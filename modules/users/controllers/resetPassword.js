const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const emailManager = require("../../../managers/emailManager");

const resetPassword = async (req, res) => {
  const usersModel = mongoose.model("users");

  const { email, new_password, reset_code } = req.body;

  if (!email) throw "Email is required";
  if (!new_password) throw "New password is required";
  if (!reset_code) throw "Reset code is required";
  if (new_password.length < 5)
    throw "Password must be atleast 5 characters long";

  const getUserWithResetCode = await usersModel.findOne({
    email: email,
    reset_code: reset_code,
  });

  if (!getUserWithResetCode) throw "Reset code doesnt match";

  const hashedPassword = await bcrypt.hash(new_password, 12);

  await usersModel.updateOne(
    {
      email: email,
    },
    {
      password: hashedPassword,
      reset_code: "",
    },
    {
      runValidators: true,
    }
  );

  await emailManager(
    email,
    "your password is reseted successfully, if you have not done that please contact Us",
    "your password is reseted successfully, if you have not done that please contact Us",
    "Password reset successfully"
  );

  res.status(200).json({
    status: "success",
    message: "Password reseted successfully",
  });
};

module.exports = resetPassword;
