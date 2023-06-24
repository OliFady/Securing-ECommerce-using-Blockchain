const express = require("express");
const nftControllers = require("./../controllers/nftControllers");
const authControllers = require("./../controllers/authController")

const router = express.Router();

router.route('/top-5-nfts').get(nftControllers.aliasTopNFTs, nftControllers.getAllNfts)
router.route('/nfts-stats').get(nftControllers.getNFTsStats)

router
    .route("/")
    .get(authControllers.protect,nftControllers.getAllNfts)
    .post(nftControllers.createNFT);

router
    .route("/:id")
    .get(nftControllers.getSingleNFT)
    .patch(nftControllers.updateNFT)
    .delete(authControllers.protect,authControllers.restrictTo("admin","guide"), nftControllers.deleteNFT);

module.exports = router;
