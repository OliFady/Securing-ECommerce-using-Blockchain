import React, { useEffect, useState, useContext } from "react";

import Style from "../styles/searchPage.module.css";
import { SearchBar } from "../SearchPage/searchBarIndex";
import { NFTCardTwo, Banner } from "../collectionPage/collectionIndex";
import images from "../img";
import { LockContext } from "../Context/LockContext";

const searchPage = () => {
  const { fetchProducts, currentAccount } = useContext(LockContext);
  const [nfts, setNfts] = useState([]);
  const [nftsCopy, setNftsCopy] = useState([]);

  useEffect(() => {
    try {
      if (currentAccount) {
        fetchProducts().then((items) => {
          setNfts(items);
          setNftsCopy(items);
          console.log(nfts);
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const onHandleSearch = (value) => {
    const filteredNFTS = nfts.filter(({ name }) =>
      name.toLowerCase().includes(value.toLowerCase())
    );

    if (filteredNFTS.length === 0) {
      setNfts(nftsCopy);
    } else {
      setNfts(filteredNFTS);
    }
  };

  const onClearSearch = () => {
    if (nfts.length && nftsCopy.length) {
      setNfts(nftsCopy);
    }
  };
  return (
    <div className={Style.searchPage}>
      <Banner bannerImage={images.creatorbackground2} />
      <SearchBar
        onHandleSearch={onHandleSearch}
        onClearSearch={onClearSearch}
      />
      <NFTCardTwo NFTData={nfts} />
    </div>
  );
};

export default searchPage;
