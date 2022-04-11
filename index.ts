import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connect from "./src/db/index";
import routes from "./src/router/index";

dotenv.config();
connect();
const app = express();

app.use(express.json());
app.use(cors());
app.use("/", routes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("listening on port " + port);
});
