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

router.get("/booklist", async (req, res) => {
  let { type, searchTerm } = req.query;
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    if (searchTerm != "") {
      searchTerm = "%" + searchTerm.trim() + "%";
      searchTerm = mysql.escape(searchTerm);
      sql = `SELECT * FROM books WHERE book_type = '${type}' AND book_name LIKE ${searchTerm}`;
    } else {
      sql = `SELECT * FROM books WHERE book_type = '${type}'`;
    }
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
// router.post (respond with only sucess status)
// Post book

router.post("/books", async (req, res) => {
  let { book_name, book_type, price, quantity, book_image } = req.body; // POST parameters are conventionally carried with the body of the HTTP reqeust (so the link won't be too long)
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    sql = `INSERT INTO books (book_name, book_type, price, quantity, book_image) 
            VALUES ('${book_name}', '${book_type}', '${price}', '${quantity}' ,'${book_image}')`;
    // sql = `INSERT INTO \`library\`.\`members\` (\`member_firstname\`, \`member_lastname\`, \`gender\`)
    //                 VALUES ('${member_firstname}', '${member_lastname}', '${gender}');`; // member_id and created_will be added by the database automatically
    const [data] = await conn.query(sql);
    console.log(data);

    if (data.affectedRows == 1) {
      // TODO: How to determine if the insert query is successful? --> This is already correct
      conn.commit(); // If we don't commit then the db will remain unchanged
      return res.json({ success: true });
    } else {
      return res.json({ success: false });
    }
  } catch (err) {
    console.log(err);
    conn.rollback();
    return res.status(400).json(err.toString());
  } finally {
    conn.release();
  }
});

//put

router.put("/books", async (req, res) => {
  let { book_id, book_name, book_type, price, quantity, book_image } = req.body; // POST parameters are conventionally carried with the body of the HTTP reqeust (so the link won't be too long)
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  console.log(req.body);
  try {
    // sql = `UPDATE \`library\`.\`books\`
    //         SET  \`book_name\` =  ${book_name} ,
    //              \`book_type\` = ${book_type} ,
    //              \`price\` = ${price},
    //              \`quantity\` = ${quantity},
    //              \`book_image\` = ${book_image}
    //         WHERE book_id = ${book_id} `;

    sql = `UPDATE books SET book_name = ?, book_type = ?, price = ?, quantity = ?, book_image = ? WHERE book_id = ?`;
    // sql = `INSERT INTO \`library\`.\`members\` (\`member_firstname\`, \`member_lastname\`, \`gender\`)
    //                 VALUES ('${member_firstname}', '${member_lastname}', '${gender}');`; // member_id and created_will be added by the database automatically
    const [data] = await conn.query(sql, [
      book_name,
      book_type,
      price,
      quantity,
      book_image,
      book_id,
    ]);
    console.log(data);

    if (data.affectedRows == 1) {
      // TODO: How to determine if the insert query is successful? --> This is already correct
      conn.commit(); // If we don't commit then the db will remain unchanged
      return res.json({ success: true });
    } else {
      return res.json({ success: false });
    }
  } catch (err) {
    console.log(err);
    conn.rollback();
    return res.status(400).json(err.toString());
  } finally {
    conn.release();
  }
});

// router.put (respond with only sucess status)

router.delete("/books_delete/:book_id/", async (req, res) => {
  let book_id = req.params.book_id;
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    sql = `DELETE FROM \`library\`.\`books\`
                    WHERE (\`book_id\` = '${book_id}');`;
    const [query_result] = await conn.query(sql);

    if (query_result.affectedRows == 1) {
      // TODO: How to determine if the delete query is successful? --> This is already correct
      conn.commit();
      return res.json({ success: true });
    } else {
      return res.json({ success: false });
    }
  } catch {
    console.log(err);
    conn.rollback();
    return res.status(400).json(err.toString());
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
    count = `SELECT COUNT(books.book_id) as total FROM books WHERE book_name LIKE ${searchTerm} OR book_type LIKE ${searchTerm} `;
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

module.exports = router;
