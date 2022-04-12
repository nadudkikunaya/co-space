const express = require("express");
const router = express.Router();
const food = require("./food");

router.use(food);

module.exports = router;
