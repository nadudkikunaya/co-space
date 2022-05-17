const express = require("express");
const router = express.Router();
const { pool, formatDate, client } = require("../config");
const mysql = require("mysql2/promise");

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

router.get("/books", async (req, res) => {
  let { page, perPage, searchTerm } = req.query;
  page = parseInt(page);
  perPage = parseInt(perPage);
  limitStart = (page - 1) * perPage;
  let sql, count;
  if (searchTerm) {
    searchTerm = "%" + searchTerm.trim() + "%";
    searchTerm = mysql.escape(searchTerm);
    count = `SELECT COUNT(books.book_id) as total FROM books 
    WHERE book_name LIKE ${searchTerm} OR book_type LIKE ${searchTerm}
   `;
    sql = `SELECT * FROM books 
           WHERE book_name LIKE ${searchTerm} OR book_type LIKE ${searchTerm}
           ORDER BY book_id
           LIMIT ${limitStart} , ${perPage}
          `;
  } else {
    count = `SELECT COUNT(books.book_id) as total FROM books `;
    sql = `SELECT * FROM books 
    ORDER BY book_id
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

// router.post (respond with only sucess status)

// router.put (respond with only sucess status)

// router.delete (respond with only sucess status)

module.exports = router;
