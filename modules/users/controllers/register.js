const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtManager = require("../../../managers/jwtManager");
const emailManager = require("../../../managers/emailManager");

const register = async (req, res) => {
  const usersModel = mongoose.model("users");

  const { name, email, password, balance, confirm_password } = req.body;

  // validations..
  if (!password) throw "Name is required";
  if (!email) throw "Email is required";
  if (password.length < 5) throw "Password must be atleast 5 characters long";
  if (password !== confirm_password) throw "Passwords do not match";
  if (!balance) throw "Balance is required";
  if (balance < 0) throw "Balance cannot be negative";
  if (!name) throw "Name is required";

  const getDuplicateEmail = await usersModel.findOne({
    email: email,
  });
  if (getDuplicateEmail)
    throw res.status(400).json({ message: "Email already exists" });

  const hashedPassword = await bcrypt.hash(password, 12);

  const createdUser = await usersModel.create({
    name: name,
    email: email,
    password: hashedPassword,
    balance: balance,
  });

  await emailManager(
    createdUser.email,
    "Hello , welcome to Expense Tracker. Your account has been created successfully",
    "<h1>Hello , welcome to Expense Tracker.</h1><br/><br/> Your account has been created successfully.",
    "Welcome to Expense Tracker"
  );
  transport.sendMail({
    to: to,
    from: "info@expensetracker.com",
    subject: subject,
    text: text,
    html: html,
  });

  res.status(200).json({
    status: "User registered successfully",
    accessToken: accessToken,
  });
};

module.exports = register;
