const express = require("express");
const router = express.Router();
const { pool, formatDate, client } = require("../config");
const mysql = require("mysql2/promise");

router.get("/foodlist", async (req, res) => {
  type = req.query.type;
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    sql = `SELECT * FROM foods WHERE food_type = '${type}'`;
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

router.get("/foods", async (req, res) => {
  let { page, perPage, searchTerm } = req.query;
  page = parseInt(page);
  perPage = parseInt(perPage);
  limitStart = (page - 1) * perPage;
  let sql, count;
  if (searchTerm) {
    if (searchTerm === "เบเกอรี่") searchTerm = "bakery";
    if (searchTerm === "ขนมขบเคี้ยว") searchTerm = "snack";
    if (searchTerm === "เครื่องดื่ม") searchTerm = "beverage";
    searchTerm = "%" + searchTerm.trim() + "%";
    searchTerm = mysql.escape(searchTerm);
    count = `SELECT COUNT(foods.food_id) as total FROM foods WHERE food_name LIKE ${searchTerm} OR food_type LIKE ${searchTerm} `;
    sql = `SELECT * FROM foods 
           WHERE food_name LIKE ${searchTerm} OR food_type LIKE ${searchTerm} 
           ORDER BY food_id
           LIMIT ${limitStart} , ${perPage}
          `;
  } else {
    count = `SELECT COUNT(foods.food_id) as total FROM foods `;
    sql = `SELECT * FROM foods 
    ORDER BY food_id
    LIMIT ${limitStart} , ${perPage}
   `;
  }
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    const [[total]] = await conn.query(count);
    const [data] = await conn.query(sql);

    return res.json({
      success: true,
      data: data,
      total: total.total,
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
