const { pool } = require("../config");

async function logger(req, res, next) {
  const timestamp = new Date().toISOString().substring(0, 19);
  console.log(`${timestamp} | ${req.method}: ${req.originalUrl}`);
  next();
}

const isAdmin = async (req, res, next) => {
  const [[user]] = await pool.query(
    "SELECT account_id FROM admin WHERE account_id = ?",
    [req.user.uid]
  );

  if (user) {
    return next();
  }

  return res
    .status(403)
    .send("You do not have permission to perform this action");
};

const isStaff = async (req, res, next) => {
  const [[user]] = await pool.query(
    "SELECT account_id FROM staff WHERE account_id = ?",
    [req.user.uid]
  );

  if (user) {
    return next();
  }
  return res
    .status(403)
    .send("You do not have permission to perform this action");
};

module.exports = {
  logger,
  isAdmin,
  isStaff,
};
