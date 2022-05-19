const jwt = require("jsonwebtoken");
const accessTokenSecret = ")J@NcRfUjXn2r5u7x!A%D*G-KaPdSgVk";

function generateToken(data) {
  return jwt.sign(
    {
      uid: data.staff_id,
      name: data.staff_name,
      username: data.staff_username,
    },
    accessTokenSecret
  );
}

function isAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.includes("Bearer ")) {
    return res.json({
      requireAuth: true,
      message: "Invalid token",
    });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, accessTokenSecret, (err, user) => {
    if (err) {
      return res.status(403).json({
        message: "JWT must be provided",
      });
    }
    req.user = user;
    //console.log(req.user);
    next();
  });
}

module.exports = {
  generateToken,
  isAuth,
};
