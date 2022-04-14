const express = require("express");
const router = express.Router();
const { pool, formatDate, client } = require("../config");

// Get for only id after path
router.get(
    "/members_get/:id/", async (req, res) => {
        // let {id, name} = req.params;
        let id = req.params.id;
        const conn = await pool.getConnection();
        await conn.beginTransaction();
        try {
            // let sql_params = [id];
            // sql = `SELECT * FROM members WHERE member_id = ?`;
            // const [query_result] = await conn.query(sql, sql_params);   // One way to substitude variable into sql query (? and array) (part of mysql2 framework, not js)

            // This is eqivalent to above syntax
            sql = `SELECT * FROM members WHERE member_id = ${id}`;
            const [query_result] = await conn.query(sql);

            return res.json(
                {
                    success: true,
                    data: query_result  // the varaible name "data" is the agreed upon name that the frontent dev will understand
                }
            );
        } catch (err) {
            console.log(err);
            conn.rollback();
            res.status(400).json(err.toString());
        } finally {
            conn.release();
        }
    }
);

// Get for both id and name (this is just experimental)
router.get(
    "/members_get/:id/:name", async (req, res) => {
        // let {id, name} = req.params;
        let id = req.params.id;
        let name = req.params.name;
        const conn = await pool.getConnection();
        await conn.beginTransaction();
        try {
            // let sql_params = [id];
            // sql = `SELECT * FROM members WHERE member_id = ?`;
            // const [query_result] = await conn.query(sql, sql_params);   // One way to substitude variable into sql query (? and array) (part of mysql2 framework, not js)

            // This is eqivalent to above syntax
            sql = `SELECT * FROM members WHERE member_id = ${id}`;
            const [query_result] = await conn.query(sql);

            console.log(name);
            console.log("a name was given");

            return res.json(
                {
                    success: true,
                    data: query_result  // the varaible name "data" is the agreed upon name that the frontent dev will understand
                }
            );
            
        } catch (err) {
            console.log(err);
            conn.rollback();
            return res.status(400).json(err.toString());
        } finally {
            conn.release();
        }
    }
);


// router.post adds a new entry to our database [(member_id), member_firstname, member_lastname, gender, (created_date)]
router.post(
    "/members_post/:mf:ml:g", async (req, res) => {
        let {member_firstname, member_lastname, gender} = req.params;
        const conn = await pool.getConnection();
        await conn.beginTransaction();
        try {
            sql = `INSERT INTO \`library\`.\`members\` (\`member_firstname\`, \`member_lastname\`, \`gender\`)
                    VALUES ('${member_firstname}', '${member_lastname}', '${gender}');`;    // member_id and created_will be added by the database automatically
            const [query_result] = await conn.query(sql);

            if (query_result.affectedRows == 1) {   // How to determine if the insert query is successful?
                return res.json(
                    {
                        success: true,
                    }
                );
            } else {
                return res.json(
                    {
                        success: false,
                    }
                );
            }
            
        } catch (err) {
            console.log(err);
            conn.rollback();
            return res.status(400).json(err.toString());
        } finally {
            conn.release();
        }
    }
);

// router.put

// router.delete


module.exports = router;