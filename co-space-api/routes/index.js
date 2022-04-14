const express = require("express");
const router = express.Router();
const food = require("./food");
const krit = require("./krit");
const chopang = require("./chopang");

router.use(food);
router.use(krit);
router.use(chopang);

module.exports = router;
