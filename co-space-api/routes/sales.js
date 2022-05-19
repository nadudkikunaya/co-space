const express = require("express");
const router = express.Router();
const { pool, formatDate, client } = require("../config");
const { isAuth } = require("./auth/auth-jwt");

router.post("/sale_foods", isAuth, async (req, res) => {
  let { selectedList, member_id, total, discount } = req.body;
  staff_id = req.user.uid;
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    billInsert = `INSERT INTO bill_foods (total, discount, staff_id, member_id) VALUES (${total}, ${discount},${staff_id}, ${member_id})`;
    const [qryBillInsert] = await conn.query(billInsert);
    console.log(qryBillInsert);
    if (qryBillInsert.affectedRows != 1) throw "Cannot create bill";

    conn.commit();

    for (let i = 0; i < selectedList.length; i++) {
      salesInsert = `INSERT INTO sale_foods (bill_id, food_id, quantity, price) 
                     VALUES (${qryBillInsert.insertId}, ${
        selectedList[i].food_id
      }, ${selectedList[i].selectedQuantity}, ${
        selectedList[i].price * selectedList[i].selectedQuantity
      })`;
      const qrySalesInsert = await conn.query(salesInsert);
    }

    conn.commit();
    return res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    conn.rollback();
    return res.status(400).json(err.toString());
  } finally {
    conn.release();
  }
});

router.post("/sale_books", isAuth, async (req, res) => {
  let { selectedList, staff_id, member_id, total, discount } = req.body;
  staff_id = req.user.uid;
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    billInsert = `INSERT INTO bill_books (total, discount, staff_id, member_id) VALUES (${total}, ${discount},${staff_id}, ${member_id})`;
    const [qryBillInsert] = await conn.query(billInsert);
    console.log(qryBillInsert);
    if (qryBillInsert.affectedRows != 1) throw "Cannot create bill";

    conn.commit();

    for (let i = 0; i < selectedList.length; i++) {
      salesInsert = `INSERT INTO sale_books (bill_id, book_id, quantity, price) 
                     VALUES (${qryBillInsert.insertId}, ${
        selectedList[i].book_id
      }, ${selectedList[i].selectedQuantity}, ${
        selectedList[i].price * selectedList[i].selectedQuantity
      })`;
      const qrySalesInsert = await conn.query(salesInsert);
    }

    for (let i = 0; i < selectedList.length; i++) {
      console.log(selectedList[i]);
      updateQuantity = `UPDATE books SET quantity = ${
        selectedList[i].quantity - selectedList[i].selectedQuantity
      } WHERE book_id = ${selectedList[i].book_id}`;
      const qryUpdateQuantity = await conn.query(updateQuantity);
    }

    conn.commit();
    return res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    conn.rollback();
    return res.status(400).json(err.toString());
  } finally {
    conn.release();
  }
});

module.exports = router;
