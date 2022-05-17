const express = require("express");
const router = express.Router();
const { pool, formatDate, client } = require("../config");
const mysql = require("mysql2/promise");
router.get("/departments_get/:department_id", async (req, res) => {
  let member_id = req.params.department_id;
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    sql = `SELECT * 
                    FROM departments
                    WHERE department_id = ${member_id};`;
    console.log(sql);
    const [[query_result]] = await conn.query(sql);

    return res.json({
      success: true,
      data: query_result, // the varaible name "data" is the agreed upon name that the frontent dev will understand
    });
  } catch (err) {
    console.log(err);
    conn.rollback();
    return res.status(400).json(err.toString());
  } finally {
    conn.release();
  }
});

router.get("/department_name", async (req, res) => {
  let member_id = req.params.department_id;
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    sql = `SELECT *
                    FROM departments
                    GROUP BY department_name;`;
    console.log(sql);
    const [query_result] = await conn.query(sql);

    return res.json({
      success: true,
      data: query_result, // the varaible name "data" is the agreed upon name that the frontent dev will understand
    });
  } catch (err) {
    console.log(err);
    conn.rollback();
    return res.status(400).json(err.toString());
  } finally {
    conn.release();
  }
});
router.get("/departments", async (req, res) => {
  let { page, perPage, searchTerm } = req.query;
  page = parseInt(page);
  perPage = parseInt(perPage);
  limitStart = (page - 1) * perPage;
  let sql, count;
  if (searchTerm) {
    searchTerm = "%" + searchTerm.trim() + "%";
    searchTerm = mysql.escape(searchTerm);
    count = `SELECT COUNT(departments.department_id) as total FROM departments WHERE department_name LIKE ${searchTerm} `;
    sql = `SELECT * FROM departments 
           WHERE department_name LIKE ${searchTerm}
           ORDER BY department_id
           LIMIT ${limitStart} , ${perPage}
          `;
  } else {
    count = `SELECT COUNT(departments.department_id) as total FROM departments `;
    sql = `SELECT * FROM departments 
    ORDER BY department_id
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

router.post("/department", async (req, res) => {
  let { department_name } = req.body; // POST parameters are conventionally carried with the body of the HTTP reqeust (so the link won't be too long)
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    sql = `INSERT INTO departments (department_name) 
              VALUES ('${department_name}')`;
    const [data] = await conn.query(sql);
    console.log(data);

    if (data.affectedRows == 1) {
      conn.commit();
      return res.json({ success: true });
    } else {
      conn.rollback();
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

router.put("/departments_put", async (req, res) => {
  let { department_id, department_name } = req.body;
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    sql = `UPDATE \`library\`.\`departments\`
              SET \`department_name\` = '${department_name}'
              WHERE department_id = ${department_id}
              `;
    const [query_result] = await conn.query(sql);
    console.log(query_result);

    if (query_result.affectedRows == 1) {
      conn.commit(); // If we don't commit then the db will remain unchanged
      return res.json({ success: true });
    } else {
      conn.rollback();
      return res.json({ success: false });
    }
  } catch (err) {
    console.log(err);
    conn.rollback();
    res.status(400).json(err.toString());
  } finally {
    conn.release();
  }
});

router.delete("/departments_delete/:department_id/", async (req, res) => {
  let department_id = req.params.department_id;
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    sql = `DELETE FROM \`library\`.\`departments\`
                      WHERE (\`department_id\` = '${department_id}');`;
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

module.exports = router;
