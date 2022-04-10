import express from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createUser = async (req: express.Request, res: express.Response) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    //find user has the same username
    const checkUserArr = await User.find({
      username,
    });

    if (checkUserArr.length === 0) {
      //if username not found

      //bcrypt password
      const newPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        username,
        password: newPassword,
      });

      newUser.save();

      res.status(200).json({
        message: "success",
      });
    } else {
      //if username already exist
      res.status(400).json({
        message: "Username already exists",
      });
    }
  } catch (err) {
    res.status(500).json({
      error: "Sever error",
    });
  }
};

const loginUser = async (req: express.Request, res: express.Response) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = await User.find({ username });

  //find user by username
  if (user[0] === undefined) {
    //not found
    res.status(404).send("User not found");
    return;
  }

  //found username
  try {
    const resultPass = await bcrypt.compare(password, user[0].password);

    if (resultPass) {
      //generate token
      const accessToken = jwt.sign(
        {
          id: user[0]._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "7d",
        }
      );

      //respond token
      res.status(200).json({
        message: "Success",
        accessToken,
      });
    } else {
      res.status(400).json({
        message: "Wrong password",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "something wrong",
    });
  }
};

const getInfo = async (req: express.Request, res: express.Response) => {
  try {
    const id = res.locals.id;
    const user = await User.findById(id);

    res.status(200).json({
      message: "success",
      user: {
        ...user["_doc"],
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Sever error",
    });
  }
};

const changeInfo = async (req: express.Request, res: express.Response) => {
  try {
    const id = res.locals.id;
    const user = await User.findById(id);

    const avatar = req.body.avatar || user.avatar;
    const name = req.body.name || user.name;
    let password = req.body.password;

    if (password) {
      password = await bcrypt.hash(password, 10);
    } else {
      password = user.password;
    }

    const updateUser = await User.findByIdAndUpdate(id, {
      avatar,
      name,
      password,
    });

    updateUser.save();

    res.status(200).json({
      message: "success",
    });
  } catch (err) {
    res.status(500).json({
      message: "Sever error",
    });
  }
};

const addManga = async (req: express.Request, res: express.Response) => {
  try {
    const manga = req.body.manga;
    const id = res.locals.id;
    const user = await User.findById(id);
    const updateUser = await User.findByIdAndUpdate(id, {
      readingList: [...user.readingList, manga],
    });
    updateUser.save();

    res.status(200).json({
      message: "success",
    });
  } catch (err) {
    res.status(500).json({
      message: "Sever error",
    });
  }
};

export default { createUser, loginUser, getInfo, changeInfo, addManga };
