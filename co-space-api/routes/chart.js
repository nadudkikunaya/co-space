const express = require("express");
const router = express.Router();
const { pool, formatDate, client } = require("../config");
const mysql = require("mysql2/promise");

router.get("/favourite_food", async (req, res) => {
  let { tag, startDate, endDate } = req.query;
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    let sql, title;
    if (tag === "food") {
      sql = `SELECT sf.food_id,f.food_name, (SELECT COUNT(*) FROM sale_foods WHERE food_id = sf.food_id ) as cnt FROM sale_foods sf
      JOIN bill_foods bf ON bf.bill_id = sf.bill_id
      JOIN foods f ON f.food_id = sf.food_id 
      WHERE DATE(bill_timestamp) BETWEEN '${startDate}' AND '${endDate}'
      GROUP BY food_id
      ORDER BY cnt DESC
LIMIT 10 `;
      title = "จำนวนอาหารที่ถูกซื้อมากที่สุด";
    } else if (tag === "book") {
      sql = `SELECT sb.book_id,b.book_name, (SELECT COUNT(*)*quantity FROM sale_books WHERE book_id = sb.book_id ) as cnt FROM sale_books sb
        JOIN bill_books bb ON bb.bill_id = sb.bill_id
        JOIN books b ON b.book_id = sb.book_id 
        WHERE DATE(bill_timestamp) BETWEEN '${startDate}' AND '${endDate}'
        GROUP BY book_id
        ORDER BY cnt DESC
  LIMIT 10 `;
      title = "จำนวนหนังสือที่ถูกซื้อมากที่สุด";
    }
    const [data] = await conn.query(sql);

    let names = [],
      qnt = [];
    for (let i = 0; i < data.length; i++) {
      names.push(data[i].food_name || data[i].book_name);
      qnt.push(data[i].cnt);
    }
    // let total = qnt.reduce((a, b) => a + b, 0);

    // for (let i = 0; i < qnt.length; i++) {
    //   let calc = Math.round((qnt[i] * 100) / total);
    //   qnt[i] = calc;
    // }

    return res.json({
      success: true,
      data: qnt,
      labels: names,
      title: title,
    });
  } catch (err) {
    console.log(err);
    conn.rollback();
    res.status(400).json(err.toString());
  } finally {
    conn.release();
  }
});

router.get("/visit_chart", async (req, res) => {
  let { startDate, endDate } = req.query;
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    let labels = [],
      initData = [];
    const sql = `SELECT HOUR(v.visit_timestamp) as hr,
    (
    SELECT COUNT(*) FROM visit_history w
    WHERE HOUR(w.visit_timestamp) = hr AND DATE(w.visit_timestamp) BETWEEN '${startDate}' AND '${endDate}'
    ) as cnt
     FROM visit_history v
    WHERE DATE(v.visit_timestamp) BETWEEN '${startDate}' AND '${endDate}'
    GROUP BY hr
    ORDER BY hr ASC`;

    for (let i = 0; i <= 23; i++) {
      labels.push(i);
      initData.push(0);
    }
    const [data] = await conn.query(sql);
    console.log(data);
    let qnt = [...initData];
    for (let i = 0; i < data.length; i++) {
      qnt[data[i].hr] = data[i].cnt;
    }

    // let total = qnt.reduce((a, b) => a + b, 0);

    // for (let i = 0; i < qnt.length; i++) {
    //   let calc = Math.round((qnt[i] * 100) / total);
    //   qnt[i] = calc;
    // }

    return res.json({
      success: true,
      data: qnt,
      labels: labels,
    });
  } catch (err) {
    console.log(err);
    conn.rollback();
    res.status(400).json(err.toString());
  } finally {
    conn.release();
  }
});

router.get("/memberregis_chart", async (req, res) => {
  let { type, date, month, year } = req.query;
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    let sql, title;
    if (type === "day") {
      sql = `SELECT HOUR(created_date) as hr,
      (SELECT COUNT(*) as cnt FROM members m WHERE HOUR(m.created_date) = hr AND DATE(created_date) = '${date}')  as cnt FROM members mb
      WHERE DATE(created_date) = '${date}'
      GROUP BY hr
      ORDER BY hr ASC `;
    } else if (type === "month") {
      sql = `SELECT DAY(mb.created_date) as d, 
      (SELECT COUNT(d) FROM members m WHERE DAY(m.created_date) = d AND MONTH(m.created_date) = '${month}' AND YEAR(m.created_date) = '${year}')  as cnt
      FROM members mb
      WHERE MONTH(mb.created_date) = '${month}' AND YEAR(mb.created_date) = '${year}'
      GROUP BY d
      ORDER BY created_date ASC`;
    } else if (type === "year") {
      sql = `SELECT MONTH(mb.created_date) as m,
        (SELECT COUNT(*) FROM members m WHERE MONTH(m.created_date) = m AND YEAR(m.created_date) = '${year}') as cnt
         FROM members mb
        WHERE YEAR(mb.created_date) = '${year}'
        GROUP BY m
        ORDER BY mb.created_date ASC`;
    }
    const [data] = await conn.query(sql);

    let labels = [],
      qnt = [];
    for (let i = 0; i < data.length; i++) {
      labels.push(data[i].hr || data[i].d || data[i].m);
      qnt.push(data[i].cnt);
    }
    // let total = qnt.reduce((a, b) => a + b, 0);

    // for (let i = 0; i < qnt.length; i++) {
    //   let calc = Math.round((qnt[i] * 100) / total);
    //   qnt[i] = calc;
    // }

    return res.json({
      success: true,
      data: qnt,
      labels: labels,
      title: title,
    });
  } catch (err) {
    console.log(err);
    conn.rollback();
    res.status(400).json(err.toString());
  } finally {
    conn.release();
  }
});

router.post("/sales_line", async (req, res) => {
  let { product, type, date, month, year } = req.body;
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    let sqlAll;
    let sqlType;
    let labels = [],
      qnt = [];
    let initData = [];
    if (type === 0) {
      sqlAll = `SELECT HOUR(bb.bill_timestamp) as hr,
      (
      SELECT SUM(total) - SUM(discount) FROM bill_${product}s cc
      WHERE DATE(cc.bill_timestamp) = DATE(bb.bill_timestamp) AND hr = HOUR(cc.bill_timestamp)
      ) as total_sum 
      FROM bill_${product}s bb
      WHERE DATE(bb.bill_timestamp) = '${date}'
      GROUP BY hr`;
      sqlType = `SELECT b.${product}_type,HOUR(bb.bill_timestamp) as hr,
      (
      SELECT SUM(total) - SUM(discount) FROM bill_${product}s cc
      WHERE DATE(cc.bill_timestamp) = DATE(bb.bill_timestamp) AND hr = HOUR(cc.bill_timestamp)
      ) as total_sum 
      FROM bill_${product}s bb
      JOIN sale_${product}s sb ON sb.bill_id = bb.bill_id
      JOIN ${product}s b ON b.${product}_id = sb.${product}_id
      WHERE DATE(bb.bill_timestamp) = '${date}'
      GROUP BY ${product}_type,hr
       
      `;
      //type === day
      for (let i = 0; i <= 23; i++) {
        labels.push(i);
        initData.push(0);
      }
    } else if (type === 1) {
      sqlAll = `SELECT DAY(bb.bill_timestamp) as d,
      (
      SELECT SUM(cc.total)-SUM(cc.discount) FROM bill_${product}s cc
      WHERE day(cc.bill_timestamp) = d AND month(cc.bill_timestamp) = '${month}' AND year(cc.bill_timestamp) = '${year}'
      ) as total_sum
      FROM bill_${product}s bb
      WHERE month(bb.bill_timestamp) = '${month}' AND year(bb.bill_timestamp) = '${year}'
      GROUP BY d
      `;

      sqlType = `SELECT b.${product}_type,DAY(bb.bill_timestamp) as d,
      (SELECT SUM(cc.total)-SUM(cc.discount) FROM bill_${product}s cc 
      JOIN sale_${product}s dd ON dd.bill_id = cc.bill_id
      JOIN ${product}s e ON e.${product}_id = dd.${product}_id
      WHERE DAY(cc.bill_timestamp) = d AND e.${product}_type = b.${product}_type
      AND MONTH(cc.bill_timestamp) = MONTH(bb.bill_timestamp) AND YEAR(cc.bill_timestamp) = YEAR(bb.bill_timestamp)
      )  as total_sum
      FROM bill_${product}s bb
            JOIN sale_${product}s sb ON sb.bill_id = bb.bill_id
            JOIN ${product}s b ON b.${product}_id = sb.${product}_id 
            WHERE MONTH(bb.bill_timestamp) = '${month}' AND YEAR(bb.bill_timestamp) = '${year}'
            GROUP BY b.${product}_type,d
            `;
      for (let i = 1; i <= 31; i++) {
        labels.push(i);
        initData.push(0);
      }
    } else if (type === 2) {
      sqlAll = `SELECT MONTH(bb.bill_timestamp) as m,
      (
      SELECT SUM(cc.total)-SUM(cc.discount) FROM bill_${product}s cc
      JOIN sale_${product}s dd ON dd.bill_id = cc.bill_id
      WHERE month(cc.bill_timestamp) = m AND year(cc.bill_timestamp) = '${year}'
      ) as total_sum
      FROM bill_${product}s bb 
      JOIN sale_${product}s sb ON sb.bill_id = bb.bill_id
      WHERE year(bb.bill_timestamp) = '${year}'
      GROUP BY m`;

      sqlType = `SELECT b.${product}_type,MONTH(bb.bill_timestamp) as m,
      (
      SELECT SUM(cc.total)-SUM(cc.discount) FROM bill_${product}s cc
      JOIN sale_${product}s dd ON dd.bill_id = cc.bill_id
      JOIN ${product}s e ON e.${product}_id = dd.${product}_id
      WHERE b.${product}_type = e.${product}_type AND month(cc.bill_timestamp) = m
      AND YEAR(cc.bill_timestamp) = '${year}'
      ) as total_sum
      FROM bill_${product}s bb 
      JOIN sale_${product}s sb ON sb.bill_id = bb.bill_id
      JOIN ${product}s b ON b.${product}_id = sb.${product}_id
      WHERE year(bb.bill_timestamp) = '${year}'
      GROUP BY ${product}_type,m`;
      for (let i = 1; i <= 12; i++) {
        labels.push(i);
        initData.push(0);
      }
    }
    //all
    const [dataAll] = await conn.query(sqlAll);
    qnt = [...initData];
    for (let i = 0; i < labels.length; i++) {
      for (let j = 0; j < dataAll.length; j++) {
        const y = dataAll[j].hr || dataAll[j].d || dataAll[j].m;
        if (y == labels[i]) {
          if (type === 0) {
            const x = dataAll[j].hr;
            qnt[x] = dataAll[j].total_sum;
          } else {
            let x = dataAll[j].d || dataAll[j].m;
            x -= 1;
            qnt[x] = dataAll[j].total_sum;
          }
        }
      }
    }

    //type
    // {
    //   label: 'Data One',
    //   backgroundColor: '#f87979',
    //   fill: true,
    //   data: [40, 39, 10, 40, 39, 80, 40],
    // },

    const [dataType] = await conn.query(sqlType);

    let dataSets = [];
    let color = [
      "#0be60f",
      "#e6800b",
      "#5b0be6",
      "#0bc5e6",
      "#e6d00b",
      "#92e60b",
      "#e60bc1",
      "#0be6af",
      "#0b5be6",
    ];
    let colorIndex = 0;
    let searchType = -1;
    for (let i = 0; i < dataType.length; i++) {
      searchType = -1;

      let product_type = dataType[i].food_type || dataType[i].book_type;
      if (product_type === "bakery") product_type = "เบเกอรี่";
      if (product_type === "snack") product_type = "ขนมขบเคี้ยว";
      if (product_type === "beverage") product_type = "เครื่องดื่ม";
      for (let j = 0; j < dataSets.length; j++) {
        if (dataSets[j].label === product_type) {
          searchType = j;
          break;
        }
      }
      if (searchType === -1) {
        dataSets.push({
          label: product_type,
          backgroundColor: color[colorIndex],
          fill: true,
          data: [...initData],
        });
        colorIndex++;
        searchType = dataSets.length - 1;
      }
      if (product_type === dataSets[searchType].label) {
        const changeAt = dataType[i].hr || dataType[i].d || dataType[i].m;
        if (type === 0)
          dataSets[searchType].data[changeAt] = dataType[i].total_sum;
        else dataSets[searchType].data[changeAt - 1] = dataType[i].total_sum;
      }
    }
    // let total = qnt.reduce((a, b) => a + b, 0);

    // for (let i = 0; i < qnt.length; i++) {
    //   let calc = Math.round((qnt[i] * 100) / total);
    //   qnt[i] = calc;
    // }
    return res.json({
      success: true,
      data: qnt,
      dataType: dataSets,
      labels: labels,
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
