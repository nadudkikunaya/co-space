const router = require("./routes");
const express = require("express");
const app = express();
const { logger } = require("./middleware");
const cors = require("cors");

const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(logger);

app.use("/api", router);

app.get("/", async (req, res) => {
  return res.json({
    connection: "success",
  });
});

app.listen(PORT, () => {
  console.log(`Mock API start on port ${PORT}`);
});
