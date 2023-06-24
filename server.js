const dotenv = require("dotenv");
const helmet = require("helmet")
const mongoose = require("mongoose");
const app = require("./app");
const next = require("next")
const dev = process.env.NODE_ENV !== "production"
const server = next({dev})
const handle = server.getRequestHandler()

dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE

mongoose
    .connect(DB, {
    })
    .then(() => {
        console.log("DB Connection Successfully");
    });


const port = process.env.PORT || 3000;

server.prepare().then(()=>{
  app.get("*",(req,res)=>{
    return handle(req,res)
  });
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "'localhost:3000'"],
    },
  })
);
app.listen(port, () => {
    console.log(`App running on port ${port}....`);
});

});


