const express = require("express");
const router = express.Router();
const { pool, formatDate, client } = require("../config");

router.get(
    "/member/:id/:name", async (req, res) => {
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

// get for only id after path
router.get(
    "/member/:id/", async (req, res) => {
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


// router.post

// router.put

// router.delete


module.exports = router;