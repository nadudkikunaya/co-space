const express = require("express");
const router = express.Router();
const { pool, formatDate, client } = require("../config");

router.post("/books/:id", async (req, res) => {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    return res.json({
      success: true,
      name: name,
      age: age,
    });
  } catch (err) {
    console.log(err);
    conn.rollback();
    res.status(400).json(err.toString());
  } finally {
    conn.release();
  }
});

module.exports = router;
