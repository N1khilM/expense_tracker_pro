const mongoose = require("mongoose");
const transactionsModel = require("../../../models/transactions.model");

const getTransactions = async (req, res) => {
  const transactionsModel = mongoose.model("transactions");

  console.log(req.query);

  const transactions = await transactionsModel.find({
    user_id: req.user._id,
    ...req.query,
  });

  res.status(200).json({
    status: " Success",
    data: transactions,
  });
};

module.exports = getTransactions;
