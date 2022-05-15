const express = require("express");
const router = express.Router();
const { pool, formatDate, client } = require("../config");

// Get for only id after path
router.get("/books/:id/", async (req, res) => {
  // let {id, name} = req.params;
  let id = req.params.id;
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    // let sql_params = [id];
    // sql = `SELECT * FROM members WHERE member_id = ?`;
    // const [query_result] = await conn.query(sql, sql_params);   // One way to substitude variable into sql query (? and array) (part of mysql2 framework, not js)

    // This is eqivalent to above syntax
    sql = `SELECT * FROM books WHERE book_id = ${id}`;
    console.log(sql);
    const [query_result] = await conn.query(sql);

    return res.json({
      success: true,
      data: query_result, // the varaible name "data" is the agreed upon name that the frontent dev will understand
    });
  } catch (err) {
    console.log(err);
    conn.rollback();
    res.status(400).json(err.toString());
  } finally {
    conn.release();
  }
});

// router.post (respond with only sucess status)

// router.put (respond with only sucess status)

// router.delete (respond with only sucess status)

module.exports = router;
