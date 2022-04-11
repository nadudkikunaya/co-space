//const router = require("./routes");
const { pool, formatDate, client, myMoment } = require("./config");
const express = require("express");
const app = express();
//const { logger } = require("./middleware");
const cors = require("cors");

const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//app.use(logger);

app.get("/", async (req, res) => {
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  sql = "SELECT * FROM members";
  const [data] = await conn.query(sql);
  res.send({
    hello: "Hello World",
    data: data,
  });
});

//app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Mock API start on port ${PORT}`);
});
