const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app");

process.on("uncaughtException",(err)=>{
  console.log(err.name,err.message)
  process.exit(1)
})
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


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}....`);
});

process.on("unhandledRejection",(err)=>{
  console.log(err.name,err.message)
  server.close(()=>{
  process.exit(1)
  })
})
