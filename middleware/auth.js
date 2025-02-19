const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  console.log(req.headers);

  try {
    const accessToken = req.headers.authorization.replace("Bearer ", "");
    const jwt_payload = jwt.verify(accessToken, process.env.jwt_salt);

    req.user = jwt_payload;
  } catch (e) {
    res.status(401).json({
      status: "failed",
      message: "Unauthorised",
    });
    return;
  }

  next();
};

module.exports = auth;
