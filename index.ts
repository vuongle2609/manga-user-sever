import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connect from "./src/db/index";
import routes from "./src/router/index";

dotenv.config();
connect();
const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json());
app.use(cors());
app.use("/", routes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("listening on port " + port);
});
