const express = require("express");
const router = express.Router();
const foods = require("./foods");
const members = require("./members");
const books = require("./books");
const sales = require("./sales");

// testapi
// const krit = require("./testapi/krit");
// const chopang = require("./testapi/chopang");
// router.use(krit);
// router.use(chopang);

// production
router.use(foods);
router.use(members);
router.use(books);
router.use(sales);
module.exports = router;
