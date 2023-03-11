import React, { useEffect, useState, useContext } from "react";
import { LockContext } from "../Context/LockContext";
import Style from "../styles/upload-nft.module.css";
import { UploadNFT } from "../UploadNFT/uploadNFTIndex";

const uploadNFT = () => {
  const { uploadToIPFS, createProduct } = useContext(LockContext);
  return (
    <div className={Style.uploadNFT}>
      <div className={Style.uploadNFT_box}>
        <div className={Style.uploadNFT_box_heading}>
          <h1>Create New Product</h1>
        </div>

        <div className={Style.uploadNFT_box_title}>
          <h2>Upload Product Image</h2>
          <p>
            File types supported: JPG, PNG, GIF, SVG, MP4, WEBM Max size: 100 MB
          </p>
        </div>

        <div className={Style.uploadNFT_box_form}>
          <UploadNFT
            uploadToIPFS={uploadToIPFS}
            createProduct={createProduct}
          />
        </div>
      </div>
    </div>
  );
};

export default uploadNFT;
