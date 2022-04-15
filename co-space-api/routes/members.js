const express = require("express");
const router = express.Router();
const { pool, formatDate, client } = require("../config");

// Get for only id after path
router.get(
    "/members_get/:member_id/",
    async (req, res) => {
        // let {id, name} = req.params;
        let member_id = req.params.member_id;
        const conn = await pool.getConnection();
        await conn.beginTransaction();
        try {
            // let sql_params = [id];
            // sql = `SELECT * FROM members WHERE member_id = ?`;
            // const [query_result] = await conn.query(sql, sql_params);   // One way to substitude variable into sql query (? and array) (part of mysql2 framework, not js)

            // This is eqivalent to above syntax
            sql = `SELECT * FROM members WHERE member_id = ${member_id}`;
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
    "/members_get/:member_id/:member_firstname",
    async (req, res) => {
        // let {id, name} = req.params;
        let member_id = req.params.id;
        let member_firstname = req.params.name;
        const conn = await pool.getConnection();
        await conn.beginTransaction();
        try {
            // let sql_params = [id];
            // sql = `SELECT * FROM members WHERE member_id = ?`;
            // const [query_result] = await conn.query(sql, sql_params);   // One way to substitude variable into sql query (? and array) (part of mysql2 framework, not js)

            // This is eqivalent to above syntax
            sql = `SELECT * FROM members WHERE member_id = ${member_id} AND member_firstname = ${member_firstname}`;
            const [query_result] = await conn.query(sql);

            console.log(member_firstname);
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
// FIXME: Browser just returns/displays "Cannot GET /api/members_post/" wihtout doing anything
router.post(
    "/members_post/:member_firstname/:member_lastname/:gender", 
    async (req, res) => {
        let {member_firstname, member_lastname, gender} = req.params;
        const conn = await pool.getConnection();
        await conn.beginTransaction();
        try {
            sql = `INSERT INTO \`library\`.\`members\` (\`member_firstname\`, \`member_lastname\`, \`gender\`)
                    VALUES ('${member_firstname}', '${member_lastname}', '${gender}');`;    // member_id and created_will be added by the database automatically
            const [query_result] = await conn.query(sql);

            if (query_result.affectedRows == 1) {   // TODO: How to determine if the insert query is successful?
                return res.json( {success: true} );
            } else {
                return res.json( {success: false} );
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

// router.put updates an existing record in the database

// router.delete deletes a specified record in the database
// FIXME: Browser just returns/displays "Cannot GET /api/members_delete/" wihtout doing anything
router.delete(
    "/members_delete/:member_id/",
    async (req, res) => {
        let member_id = req.params.member_id;
        const conn = await pool.getConnection();
        await conn.beginTransaction();
        try {
            sql = `DELETE FROM \`library\`.\`members\`
                    WHERE (\`member_id\` = '${member_id}');`;
            const [query_result] = await conn.query(sql);

            if (query_result.affectedRows == 1) {   // TODO: How to determine if the delete query is successful?
                return res.json( {success: true} );
            } else {
                return res.json( {success: false} );
            }
        } catch {
            console.log(err);
            conn.rollback();
            return res.status(400).json(err.toString());
        } finally {
            conn.release();
        }
    }
);


module.exports = router;