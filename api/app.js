const helmet = require("helmet")
const express = require("express");
const morgan = require("morgan");

const nftsRouter = require("./routes/nftsRoute");
const usersRouter = require("./routes/usersRoute");

const app = express();
app.use(express.json());

app.use(helmet())

app.use(morgan("dev"));
app.use(express.static(`${__dirname}/nft-data/img`));


app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    console.log(req.headers)
    next();
});

app.use("/api/v1/nfts", nftsRouter);
app.use("/api/v1/users", usersRouter);

module.exports = app;
