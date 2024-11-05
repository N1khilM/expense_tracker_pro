const mongoose = require("mongoose");
const validator = require("validator");

const editTransaction = async (req, res) => {
  const transactionModel = mongoose.model("transactions");
  const usersModel = mongoose.model("users");

  const { transaction_id, remarks, amount, transaction_type } = req.body;

  if (!transaction_id) throw "transaction id is required";

  if (transaction_type !== "income" && transaction_type !== "expense")
    throw "Transaction type must be income or expense";

  if (!validator.isMongoId(transaction_id.toString()))
    throw "please provide a valid id ";

  const getTransactions = await transactionModel.findOne({
    _id: transaction_id,
  });
  if (!getTransactions) throw "transaction not found";

  if (getTransactions.transaction_type === "income") {
    await usersModel.updateOne(
      { _id: getTransactions.user_id },
      {
        $inc: {
          balance: getTransactions.amount * -1,
        },
      },
      {
        runValidators: true,
      }
    );
  } else {
    await usersModel.updateOne(
      { _id: getTransactions.user_id },
      {
        $inc: {
          balance: getTransactions.amount,
        },
      },
      {
        runValidators: true,
      }
    );
  }
  await transactionModel.updateOne(
    {
      _id: transaction_id,
    },
    {
      remarks,
      transaction_type,
      amount,
    },
    {
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "edit Transaction",
  });
};

module.exports = editTransaction;
