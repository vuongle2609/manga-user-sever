import mongoose, { Schema } from "mongoose";

const user = new Schema(
  {
    username: {
      type: String,
      required: true,
      minLength: 6,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    name: {
      type: String,
      default: "Cute user",
    },
    avatar: {
      type: String,
      default: "https://media.discordapp.net/attachments/893838005830303796/963523364524286022/unknown.png",
    },
    role: {
      type: String,
      default: "User",
    },
    readingList: {
      type: Array,
    },
    historyList: {
      type: Array,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", user);
