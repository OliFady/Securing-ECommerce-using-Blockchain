import React, { useContext, useEffect, useState } from "react";
import Style from "../styles/index.module.css";
import {
  HeroSection,
  BigNFTSilder,
  NFTCard,
  FollowerTab,
} from "../components/componentsindex";
import { LockContext } from "../Context/LockContext";
import { getTopCreators } from "../TopCreators/TopCreators";
const Home = () => {
  const { checkIfWalletConnected } = useContext(LockContext);
  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  const { fetchProducts } = useContext(LockContext);
  const [nfts, setNfts] = useState([]);
  const [nftsCopy, setNftsCopy] = useState([]);
  const creators = getTopCreators(nfts);

  useEffect(() => {
    fetchProducts().then((items) => {
      setNfts(items);
      setNftsCopy(items);
      console.log(nfts);
    });
  }, []);

  return (
    <div className={Style.homePage}>
      <HeroSection />
      <BigNFTSilder />
      <FollowerTab TopCreator={creators} />
      <NFTCard NFTData={nfts} />
    </div>
  );
};

export default Home;
