import React, { useEffect, useState } from "react";
import NFTDetailsPage from "../NFTDetailsPage/NFTDetailsPage";
import { useRouter } from "next/router";

const NFTDetails = () => {
  const [product, setProduct] = useState({
    image: "",
    tokenId: "",
    name: "",
    owner: "",
    price: "",
    seller: "",
  });

  const router = useRouter();
  useEffect(() => {
    if (!router.isReady) return;
    setProduct(router.query);
  }, [router.isReady]);
  return (
    <div>
      <NFTDetailsPage product={product} />
    </div>
  );
};

export default NFTDetails;
