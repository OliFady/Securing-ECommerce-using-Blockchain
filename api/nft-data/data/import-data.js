const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const NFT = require("./../../models/nftModel");

dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE


mongoose
    .connect(DB, {
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
    })
    .then(() => {
        console.log("DB Connection Successfully");
    });

const nfts = JSON.parse(
    fs.readFileSync(`${__dirname}/nft-simple.json`, "utf-8")
);

const importDate = async () => {
    try {
        await NFT.create(nfts);
        console.log("DATA successfully Loaded");
        process.exit();
    } catch (error) {
        console.log(error);
    }
};

const deleteData = async () => {
    try {
        await NFT.deleteMany();
        console.log("DATA successfully Deleted");
        process.exit();
    } catch (error) {
        console.log(error);
    }
};

if (process.argv[2] === "--import") {
    importDate();
} else if (process.argv[2] === "--delete") {
    deleteData();
}
