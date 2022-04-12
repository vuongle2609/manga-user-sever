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
    res.status(404).json({
      message: "User not found"
    });
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
        user: {
          ...user[0]
        }
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
    let newPassword = req.body.newPassword;
    const password = req.body.password

    if (newPassword) {
      try {
        const result = await bcrypt.compare(password, user.password)
        if (result) {
          newPassword = await bcrypt.hash(newPassword, 10);
        } else {
          res.status(400).json({
            message: "Wrong password",
          });
          return;
        }
      } catch (err) {
        res.status(500).json({
          message: "Sever error",
        });
        return;
      }
    } else {
      newPassword = user.password;
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
      readingList: [manga, ...user.readingList],
    });
    updateUser.save();

    res.status(200).json({
      message: "success",
      user: {
        ...user["_doc"],
        readingList: [manga, ...user.readingList],
      }
    });
  } catch (err) {
    res.status(500).json({
      message: "Sever error",
    });
  }
};

const deleteManga = async (req: express.Request, res: express.Response) => {
  try {
    const manga_ep = req.body.manga_ep
    console.log(manga_ep)
    const id = res.locals.id;
    const user = await User.findById(id);
    const oldArr = user.readingList

    const newArr = []

    interface mangaObjType {
      mangaEP: String,
      view: Number,
      time: Date,
      status: String,
      rating: Number,
      genres: String[],
      cover: String
    }

    oldArr.filter((o: mangaObjType) => {
      if (o.mangaEP !== manga_ep) {
        newArr.push(o)
      }
    })

    const updateUser = await User.findByIdAndUpdate(id, {
      readingList: newArr,
    });

    updateUser.save();

    res.status(200).json({
      message: "success",
      user: {
        ...user["_doc"],
        readingList: newArr,
      }
    });
  } catch (err) {
    res.status(500).json({
      message: "Sever error",
    });
  }
}

const historyAdd = async (req: express.Request, res: express.Response) => {
  try {
    const manga = req.body.manga;
    const id = res.locals.id;
    const user = await User.findById(id);
    const updateUser = await User.findByIdAndUpdate(id, {
      historyList: [manga, ...user.historyList],
    });
    updateUser.save();

    res.status(200).json({
      message: "success",
      user: {
        ...user["_doc"],
        historyList: [manga, ...user.historyList],
      }
    });
  } catch (err) {
    res.status(500).json({
      message: "Sever error",
    });
  }
}

export default { createUser, loginUser, getInfo, changeInfo, addManga, deleteManga, historyAdd };
