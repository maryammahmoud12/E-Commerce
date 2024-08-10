import jwt from "jsonwebtoken";
import userModel from "../../../DB/models/user.model.js";
import bcrypt from "bcrypt";

import { asyncHandler } from "../../middleware/asynchandler.js";
import { appError } from "../../utils/appError.js";
import { sendEmail } from "../../service/sendEmail.js";
import { customAlphabet } from "nanoid";

export const signUp = asyncHandler(async (req, res, next) => {
  const { name, email, password, age, address, phone } = req.body;
  const userExist = await userModel.findOne({ email });
  userExist && next(new appError("user already exist", 200));

  const token = jwt.sign({ email }, process.env.jwt_verifyEmail, {
    expiresIn: 60,
  });
  const link = `${req.protocol}://${req.headers.host}/users/confirmEmail/${token}`;
  sendEmail(
    email,
    "confirm your email 😊",
    `<a href = "${link}"> click here </a>`
  );

  const hash = bcrypt.hashSync(password, +process.env.saltRounds);

  const user = await userModel.create({
    name,
    email: email.toLowerCase(),
    password: hash,
    age,
    address,
    phone,
  });

  req.data = {
    model: userModel,
    id: user._id,
  };

  return res.status(201).json({ msg: "done", user });
});

export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const decoded = jwt.verify(token, process.env.jwt_verifyEmail);
  if (!decoded?.email) {
    return next(new appError("invalid token", 202));
  }
  const user = await userModel.findOneAndUpdate(
    { email: decoded.email, confirmed: false },
    { confirmed: true }
  );
  if (!user) {
    return next(new appError("user not found or already confirmed", 203));
  }
  return res.status(204).json({ msg: "done" });
});

export const forgetPass = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new appError("user not found", 203));
  }

  const code = customAlphabet("0123456789", 5);
  const newCode = code();
  await sendEmail(
    email,
    "code for forget password :  ",
    `<h1> code is : "${newCode}" </h1>`
  );
  await userModel.updateOne({ email }, { code: newCode });
  return res.json({ msg: "done" });
});

export const resetPass = asyncHandler(async (req, res, next) => {
  const { email, code, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new appError("user not found", 203));
  }
  if (user.code !== code || code === "") {
    return next(new appError("invalid code", 204));
  }
  const hash = bcrypt.hashSync(password, +process.env.saltRounds);
  await userModel.updateOne({ email }, { password: hash, code: "" });
  return res.status(205).json({ msg: "done" });
});

export const signIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email, confirmed: true });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return next(new appError("user not found or invalid password", 205));
  }
  const token = jwt.sign({ email, role: user.role }, process.env.jwt_signIn);
  await userModel.updateOne({ email }, { loggedIn: true });
  return res.status(206).json({ msg: "done", token });
});
