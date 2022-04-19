const express = require("express");
const router = express.Router();
const { pool, formatDate, client } = require("../config");


// Get for both id and name ("/api/members_get/xxx/xxx") (this is just experimental)
router.get(
    "/members_get/:id/:firstname",
    async (req, res) => {
        // let {member_id, member_firstname} = req.params;
        let member_id = req.params.id;      // The "req.params.id" refers to the id given in the link
        let member_firstname = req.params.firstname;
        const conn = await pool.getConnection();
        await conn.beginTransaction();
        try {
            // let sql_params = [member_id, member_firstname];
            // console.log(sql_params);
            // sql = `SELECT *
            //          FROM members
            //          WHERE member_id = ? AND member_firstname = ?`;
            // const [query_result] = await conn.query(sql, sql_params);   // One way to substitude variable into sql query (? and array) (part of mysql2 framework, not js)

            // This is eqivalent to above syntax
            sql = `SELECT * 
                    FROM members
                    WHERE member_id = ${member_id} AND member_firstname = \'${member_firstname}\';`;
            console.log(sql);
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
            return res.status(400).json(err.toString());
        } finally {
            conn.release();
        }
    }
);
// Get for both id and name, but will use query part of HTTP request instead (incidentally called "Params" in Postman) (aka the question mark "/api/members_get/?id=xxx&firstname=xxx") (also experimental)
router.get(
    "/members_get",
    async (req, res) => {
        let member_id = req.query.id;  // This will be from "?id=xxx"
        let member_firstname = req.query.firstname; // This will be from "?firstname=xxx"
        const conn = await pool.getConnection();
        await conn.beginTransaction();
        try {
            sql = `SELECT *
                    FROM members
                    WHERE member_id = ${member_id} AND member_firstname = \'${member_firstname}\';`;
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
            return res.status(400).json(err.toString());
        } finally {
            conn.release();
        }
    }
);

// (From now on there will be no more experiments) Get for only id after path
router.get(
    "/members_get/:member_id/",
    async (req, res) => {
        // let {id, name} = req.params;
        let member_id = req.params.member_id;
        const conn = await pool.getConnection();
        await conn.beginTransaction();
        try {
            sql = `SELECT *
                    FROM members
                    WHERE member_id = ${member_id};`;
            const [query_result] = await conn.query(sql);

            return res.json(
                {
                    success: true,
                    data: query_result  // the varaible name "data" is the agreed upon name that the frontent part will understand
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

// router.post adds a new entry to our database [(member_id), member_firstname, member_lastname, gender, (created_date)]
// FIXME: Browser just returns/displays "Cannot GET /api/members_post/" wihtout doing anything
// --> No need to fix, as browser will always send a GET request. We need to us another client to test this out, such as Postman
router.post(
    "/members_post", 
    async (req, res) => {
        let {member_firstname, member_lastname, gender} = req.body;     // POST parameters are conventionally carried with the body of the HTTP reqeust (so the link won't be too long)
        const conn = await pool.getConnection();
        await conn.beginTransaction();
        try {
            sql = `INSERT INTO \`library\`.\`members\` (\`member_firstname\`, \`member_lastname\`, \`gender\`)
                    VALUES ('${member_firstname}', '${member_lastname}', '${gender}');`;    // member_id and created_will be added by the database automatically
            const [query_result] = await conn.query(sql);
            console.log(query_result);

            if (query_result.affectedRows == 1) {   // TODO: How to determine if the insert query is successful? --> This is already correct
                conn.commit();      // If we don't commit then the db will remain unchanged
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
// --> No need to fix, as browser will always send a GET request. We need to us another client to test this out, such as Postman
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

            if (query_result.affectedRows == 1) {   // TODO: How to determine if the delete query is successful? --> This is already correct
                conn.commit();
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