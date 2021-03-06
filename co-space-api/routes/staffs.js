const express = require("express");
const router = express.Router();
const { pool, formatDate, client } = require("../config");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
// Get for only id after path
router.get("/staffs/:id/", async (req, res) => {
  // let {id, name} = req.params;
  let id = req.params.id;
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    // let sql_params = [id];
    // sql = `SELECT * FROM members WHERE member_id = ?`;
    // const [query_result] = await conn.query(sql, sql_params);   // One way to substitude variable into sql query (? and array) (part of mysql2 framework, not js)

    // This is eqivalent to above syntax
    sql = `SELECT * FROM staffs WHERE staff_id = ${id}`;
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

router.get("/staffs", async (req, res) => {
  let { page, perPage, searchTerm } = req.query;
  page = parseInt(page);
  perPage = parseInt(perPage);
  limitStart = (page - 1) * perPage;
  let sql, count;
  if (searchTerm) {
    searchTerm = "%" + searchTerm.trim() + "%";
    searchTerm = mysql.escape(searchTerm);
    count = `SELECT COUNT(staffs.staff_id) as total FROM staffs WHERE staff_name LIKE ${searchTerm} `;
    sql = `SELECT staff_id,staff_name,staff_username,gender,department_id FROM staffs 
           WHERE staff_name LIKE ${searchTerm} 
           ORDER BY staff_id
           LIMIT ${limitStart} , ${perPage}
          `;
  } else {
    count = `SELECT COUNT(staffs.staff_id) as total FROM staffs `;
    sql = `SELECT staff_id,staff_name,staff_username,gender,department_id FROM staffs 
    ORDER BY staff_id
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

//post

router.post("/staffs", async (req, res) => {
  let {
    staff_name,
    staff_username,
    staff_password_hash,
    gender,
    department_id,
  } = req.body; // POST parameters are conventionally carried with the body of the HTTP reqeust (so the link won't be too long)
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    staff_password_hash = await bcrypt.hash(staff_password_hash, 5);
    sql = `INSERT INTO staffs (staff_name, staff_username, staff_password_hash , gender, department_id) 
              VALUES ('${staff_name}', '${staff_username}', '${staff_password_hash}', '${gender}' ,'${department_id}')`;
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

router.put("/staffs", async (req, res) => {
  let {
    staff_id,
    staff_name,
    staff_username,
    staff_password_hash,
    gender,
    department_id,
  } = req.body;
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    staff_password_hash = await bcrypt.hash(staff_password_hash, 5);
    sql = `UPDATE \`library\`.\`staffs\`
              SET  staff_name =  ? , 
                   staff_username = ? , 
                   staff_password_hash = ?, 
                   gender = ?, 
                   department_id = ?
              WHERE (staff_id = ? )`;

    const [data] = await conn.query(sql, [
      staff_name,
      staff_username,
      staff_password_hash,
      gender,
      department_id,
      staff_id,
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

// delete

router.delete("/staffs_delete/:staff_id/", async (req, res) => {
  let staff_id = req.params.staff_id;
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    sql = `DELETE FROM \`library\`.\`staffs\`
                      WHERE (\`staff_id\` = '${staff_id}');`;
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
