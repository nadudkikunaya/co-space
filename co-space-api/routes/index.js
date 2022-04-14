const express = require("express");
const router = express.Router();
const food = require("./food");
const member = require("./member");
const krit = require("./krit");
const chopang = require("./chopang");
const book = require("./books")

// test
router.use(krit);
router.use(chopang);

// production
router.use(food);
router.use(member);
router.use(book);

module.exports = router;
