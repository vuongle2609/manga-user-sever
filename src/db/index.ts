import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const user = process.env.USER;
const password = process.env.PASS;
const cluster = process.env.CLUSTER;

const connect = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${user}:${password}@${cluster}.mongodb.net/manga-anime?retryWrites=true&w=majority`
    );

    console.log("connected");
  } catch (err) {
    console.log(err);
  }
};

export default connect;
