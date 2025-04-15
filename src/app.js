const express = require("express");

const helmet = require("helmet");
const cors = require("cors");
const router = require("./routes");
const errorHandler = require("./utils/errorHandler");
require("dotenv").config();

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(cors());

app.use("/api/v1", router);

app.get("/", (req, res) => {
  return res.send("¡Hola desde mi clon de Instagram!");
});

app.use(errorHandler);

module.exports = app;
