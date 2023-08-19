import User from "../models/User";
import multer from "multer";
import sharp from "sharp";
import { NextFunction, Request,Response } from "express";

//image stored in buffer
const multerStorage = multer.memoryStorage();

// Multer filter
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    console.log("no");
    cb(null, false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

export const uploadUserImages = upload.fields([
  { name: "profilePicture" },
  { name: "coverPicture" }
]);

//Resize user photo
export const resizeUserImages = async (req : Request, res : Response, next : NextFunction) => {
  try {
    // console.log(req.files.profilePicture, req.files.coverPicture);
    if (!req.files['profilePicture'] && !req.files['coverPicture']) return next();

    //1) profilePicture
    if (req.files['profilePicture']) {
      req.body.profilePicture = `user-profile-${
        res.locals.user.id
      }-${Date.now()}.jpeg`;
      await sharp(req.files['profilePicture'][0].buffer)
        .resize(500, 500)
        .toFormat("jpeg")
        //90 % quality
        .jpeg({ quality: 90 })
        .toFile(`./client/src/assets/users/${req.body.profilePicture}`);
    }

    //1) coverPicture
    if (req.files['coverPicture']) {
      req.body.coverPicture = `user-cover-${res.locals.user.id}-${Date.now()}.jpeg`;
      await sharp(req.files['coverPicture'][0].buffer)
        .resize(1000, 1000)
        .toFormat("jpeg")
        //90 % quality
        .jpeg({ quality: 90 })
        .toFile(`./client/src/assets/users/${req.body.coverPicture}`);
    }

    next();
  } catch (err) {
    console.log(err);
    res.status(400).json({ status: "error", msg: err.message });
  }
};

// Return object of the allowed fields
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// Get All Users
export const getAllUsers = async (req : Request, res : Response, next : NextFunction) => {
  try {
    const users = await User.find();
    res.status(200).json({ status: "success", data: { users } });
  } catch (err) {
    console.log(err);
    res.status(400).json({ status: "error", msg: err.message });
  }
};

// Get User
export const getUser = async (req : Request, res : Response, next : NextFunction) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({ status: "success", data: { user } });
  } catch (err) {
    console.log(err);
    res.status(400).json({ status: "error", msg: err.message });
  }
};

// Update User(by himself)
export const updateMe = async (req : Request, res : Response, next : NextFunction) => {
  const filteredBody = filterObj(
    req.body,
    "name",
    "email",
    "bio",
    "location",
    "website",
    "profilePicture",
    "coverPicture"
  );

  const updatedUser = await User.findByIdAndUpdate(res.locals.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  return res.status(200).json({
    status: "success",
    data: {
      user: updatedUser
    }
  });
};

// Delete User(by himself)
export const deleteMe = async (req : Request, res : Response) => {
  await User.findByIdAndDelete(res.locals.user.id);
  res.status(204).json({
    status: "success",
    data: null
  });
};

// Update User
export const updateUser = async (req : Request, res : Response) => {
  try {
    if (req.body.password) {
      res.status(400).json({
        status: "fail",
        msg: "You cannot update password using this route"
      });
    }
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    res.status(201).json({ status: "success", data: { user } });
  } catch (err) {
    console.log(err);
    res.status(400).json({ status: "error", msg: err.message });
  }
};

// Delete User
export const deleteUser = async (req : Request, res : Response) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res
      .status(204)
      .json({ status: "success", msg: "User successfully deleted" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ status: "error", msg: err.message });
  }
};
