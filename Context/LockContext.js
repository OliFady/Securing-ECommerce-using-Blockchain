import React, { useState, useEffect, useContext } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { LockAddress, LockABI } from "./constants";
import axios from "axios";
import { create as ipfsHttpClient } from "ipfs-http-client";

const projectId = "2MNDLputonYCAhYX2HOGHAafmeK";
const projectSecretKey = "0731a18050bcefe4541bbc47ee1cc19d";

const auth = `Basic ${Buffer.from(`${projectId}:${projectSecretKey}`).toString(
  "base64"
)}`;
const client = ipfsHttpClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
    "Access-Control-Allow-Origin": ["*"],
  },
});

const subdomain = "https://needit.infura-ipfs.io";

const fetchContract = (signerOrProvider) =>
  new ethers.Contract(LockAddress, LockABI, signerOrProvider);

const connectingWithSmartContract = async () => {
  try {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);
    return contract;
  } catch (error) {
    console.log("can't connect to Smart Contract");
  }
};

export const LockContext = React.createContext();

export const LockProvider = ({ children }) => {
  const [currentAccount, setcurrentAccount] = useState("");

  const router = useRouter();
  const checkIfWalletConnected = async () => {
    try {
      if (!window.ethereum) return console.log("Install MetaMask");

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setcurrentAccount(accounts[0]);
      } else {
        console.log("no account Found");
      }
      console.log(currentAccount);
    } catch (error) {
      console.log("can't connect Wallet");
    }
  };

  useEffect(() => {
    checkIfWalletConnected;
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) return console.log("Install MetaMask");

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setcurrentAccount(accounts[0]);
    } catch (error) {
      console.log("can't connect to wallet");
    }
  };

  const uploadToIPFS = async (file) => {
    try {
      const added = await client.add({ content: file });
      const url = `${subdomain}/ipfs/${added.path}`;
      return url;
    } catch (error) {
      console.log("can't upload Image");
    }
  };

  const createProduct = async (name, price, image, description, router) => {
    if (!name || !description || !price || !image) {
      return console.log("data is missing");
    }
    const data = JSON.stringify({ name, description, image });
    try {
      const added = await client.add(data);
      const url = `${subdomain}/ipfs/${added.path}`;
      await createSale(url, price);
    } catch (error) {
      console.log(error);
    }
  };

  const createSale = async (url, formInputPrice, isReselling, id) => {
    try {
      console.log(url, formInputPrice, isReselling, id);
      const price = ethers.utils.parseUnits(formInputPrice, "ether");

      const contract = await connectingWithSmartContract();

      const listingPrice = await contract.getListingPrice();

      const transaction = !isReselling
        ? await contract.createToken(url, price, {
            value: listingPrice.toString(),
          })
        : await contract.resellToken(id, price, {
            value: listingPrice.toString(),
          });

      await transaction.wait();
      router.push("/searchPage");
      console.log(transaction);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProducts = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider();

      const contract = fetchContract(provider);

      const data = await contract.fetchMarketItems();

      const items = await Promise.all(
        data.map(
          async ({ tokenId, seller, owner, price: unformattedPrice }) => {
            const tokenURI = await contract.tokenURI(tokenId);

            const {
              data: { image, name, description },
            } = await axios.get(tokenURI);
            const price = ethers.utils.formatUnits(
              unformattedPrice.toString(),
              "ether"
            );

            return {
              price,
              tokenId: tokenId.toNumber(),
              seller,
              owner,
              image,
              name,
              description,
              tokenURI,
            };
          }
        )
      );
      console.log(items);
      return items;
    } catch (error) {
      console.log(error);
    }
  };

  const buyProduct = async (product) => {
    try {
      const contract = await connectingWithSmartContract();
      const price = ethers.utils.parseUnits(product.price.toString(), "ether");

      const transaction = await contract.createMarketSale(product.tokenId, {
        value: price,
      });

      await transaction.wait();
      router.push("/author");
    } catch (error) {
      console.log(error);
    }
  };
  const fetchMyNFTsOrListedNFTs = async (type) => {
    try {
      if (currentAccount) {
        const contract = await connectingWithSmartContract();

        const data =
          type == "fetchItemsListed"
            ? await contract.fetchItemsListed()
            : await contract.fetchMyNFTs();

        const items = await Promise.all(
          data.map(
            async ({ tokenId, seller, owner, price: unformattedPrice }) => {
              const tokenURI = await contract.tokenURI(tokenId);
              const {
                data: { image, name, description },
              } = await axios.get(tokenURI);
              const price = ethers.utils.formatUnits(
                unformattedPrice.toString(),
                "ether"
              );

              return {
                price,
                tokenId: tokenId.toNumber(),
                seller,
                owner,
                image,
                name,
                description,
                tokenURI,
              };
            }
          )
        );
        return items;
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMyNFTsOrListedNFTs();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <LockContext.Provider
      value={{
        connectWallet,
        checkIfWalletConnected,
        uploadToIPFS,
        createProduct,
        createSale,
        currentAccount,
        fetchProducts,
        buyProduct,
        fetchMyNFTsOrListedNFTs,
      }}
    >
      {children}
    </LockContext.Provider>
  );
};
