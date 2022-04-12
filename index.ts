import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connect from "./src/db/index";
import routes from "./src/router/index";

dotenv.config();
connect();
const app = express();

app.use(express.json());

const corsOpt = {
  origin: process.env.CORS_ALLOW_ORIGIN || '*',
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['content-type', 'authorization']
};
app.use(cors(corsOpt));
app.options('*', cors(corsOpt));

app.use("/", routes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("listening on port " + port);
});
