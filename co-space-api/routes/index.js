const express = require("express");
const router = express.Router();
const foods = require("./foods");
const members = require("./members");
const books = require("./books");
const sales = require("./sales");
const staffs = require("./staffs");
const departments = require("./departments");
const visit = require("./visit");
const chart = require("./chart");
const auth = require("./auth");

// testapi
// const krit = require("./testapi/krit");
// const chopang = require("./testapi/chopang");
// router.use(krit);
// router.use(chopang);

// production
router.use(auth);
router.use(departments);
router.use(staffs);
router.use(foods);
router.use(members);
router.use(books);
router.use(sales);
router.use(visit);
router.use(chart);

module.exports = router;
