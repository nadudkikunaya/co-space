const mysql = require("mysql2/promise");
const moment = require("moment-timezone");
require("dotenv").config();

// module.exports.pool = mysql.createPool({
//   host: "db-project.cgh3x88llksm.ap-southeast-1.rds.amazonaws.com",
//   user: "admin",
//   password: "SQvSjKK5MH",
//   database: "library",
//   timezone: "Asia/Bangkok",
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

module.exports.pool = mysql.createPool({
  host: "db-project.cgh3x88llksm.ap-southeast-1.rds.amazonaws.com",
  user: "admin",
  password: "SQvSjKK5MH",
  database: "library",
  timezone: "Asia/Bangkok",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports.formatDate = (date) => {
  let tzDate = moment.tz(date, "Asia/Bangkok");
  return tzDate.format();
};

module.exports.myMoment = (date) => {
  let tzDate;
  if (date != null || date != undefined)
    tzDate = moment(date).tz("Asia/Bangkok");
  else tzDate = moment().tz("Asia/Bangkok");
  return tzDate;
};
