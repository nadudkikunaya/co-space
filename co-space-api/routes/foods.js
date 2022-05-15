const express = require("express");
const router = express.Router();
const { pool, formatDate, client } = require("../config");

router.get("/foodlist", async (req, res) => {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    sql = `SELECT * FROM foods`;
    const [data] = await conn.query(sql);

    return res.json({
      success: true,
      data: data,
    });
  } catch (err) {
    console.log(err);
    conn.rollback();
    res.status(400).json(err.toString());
  } finally {
    conn.release();
  }
});

router.get("/member", async (req, res) => {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    sql = `SELECT * FROM members`;
    const [data] = await conn.query(sql);

    return res.json({
      success: true,
      data: data,
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
