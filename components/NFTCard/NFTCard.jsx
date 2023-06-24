import React, { useState,useEffect } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsImages } from "react-icons/bs";
import Image from "next/image";
import Link from "next/link";
import Style from "./NFTCard.module.css";

const NFTCard = ({ NFTData }) => {


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
  return (
    <div className={Style.NFTCard}>
      {sliderData?.map((el, i) => (
        <Link href={{ pathname: "/NFT-details", query: el }}>
          <div className={Style.NFTCard_box} key={i + 1}>
            <div className={Style.NFTCard_box_img}>
              <Image
                src={el.images}
                alt="NFT images"
                width={600}
                height={600}
                className={Style.NFTCard_box_img_img}
              />
            </div>

            <div className={Style.NFTCard_box_update}>

              <div className={Style.NFTCard_box_update_right}>
                <div className={Style.NFTCard_box_update_right_info}>
                  <small>Remaining time</small>
                  <p>3h : 15m : 20s</p>
                </div>
              </div>
            </div>

            <div className={Style.NFTCard_box_update_details}>
              <div className={Style.NFTCard_box_update_details_price}>
                <div className={Style.NFTCard_box_update_details_price_box}>
                  <h4>
                    {el.name} 
                  </h4>

                  <div
                    className={Style.NFTCard_box_update_details_price_box_box}
                  >
                    <div
                      className={Style.NFTCard_box_update_details_price_box_bid}
                    >
                      <small>Current Bid</small>
                      <p>{el.price}</p>
                    </div>
                    <div
                      className={
                        Style.NFTCard_box_update_details_price_box_stock
                      }
                    >
                      <small>61 in stock</small>
                    </div>
                  </div>
                </div>
              </div>
              <div className={Style.NFTCard_box_update_details_category}>
                <BsImages />
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default NFTCard;
