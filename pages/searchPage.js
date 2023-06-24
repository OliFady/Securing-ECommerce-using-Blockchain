import React, { useEffect, useState, useContext } from "react";

import Style from "../styles/searchPage.module.css";
import { SearchBar } from "../SearchPage/searchBarIndex";
import { NFTCardTwo, Banner } from "../collectionPage/collectionIndex";
import images from "../img";
import { LockContext } from "../Context/LockContext";

const searchPage = () => {
  const {getNft, fetchProducts, currentAccount } = useContext(LockContext);
  const [nfts, setNfts] = useState([]);
  const [nftsCopy, setNftsCopy] = useState([]);

  const [sliderData,setSliderData] = useState([])

  useEffect(()=>{
    const fetchNft = async()=>{
         const response = await fetch(
            'http://127.0.0.1:3000/api/v1/nfts',{headers:{'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0OTJhZDQ4MWE2NmU3M2NlYWZlZjNlNyIsImlhdCI6MTY4NzQ5ODM5MywiZXhwIjoxNjkxODE4MzkzfQ._9MyOLEhqIY73E4T-ksGRCVMwq0Z870zvPcMmip_YGI'}}
         );
         const data = await response.json();
         console.log(data.data.nfts);
         setSliderData(data.data.nfts);
    }
    fetchNft()
  },[])
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
      <NFTCardTwo NFTData={sliderData} />
    </div>
  );
};

export default searchPage;
