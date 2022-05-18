const express = require("express");
const router = express.Router();
const { pool, formatDate, client } = require("../config");
const mysql = require("mysql2/promise");

router.post("/visit", async (req, res) => {
  let memberId = req.body.memberId;
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    sqlCheck = `SELECT member_id FROM members WHERE phone = ${memberId}`;
    const [[check]] = await conn.query(sqlCheck);
    if (check) {
      sql = `INSERT INTO visit_history (member_id) VALUES (${check.member_id})`;
      const [data] = await conn.query(sql);
      if (data.affectedRows == 1) {
        conn.commit();
        return res.json({ success: true });
      }
    }
    return res.json({ success: false });
  } catch {
    console.log(err);
    conn.rollback();
    return res.status(400).json(err.toString());
  } finally {
    conn.release();
  }
});
module.exports = router;
