const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const registerRoute = require("./routes/auth.js");
const dashboardRoute = require("./routes/dashboard.js");
const cookieParser = require("cookie-parser");
require("dotenv").config();

app.use(
  cors({
    origin: "https://mern-auth-frontend-swq3.onrender.com", // your frontend url
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGODB_URL)
  .then((res) => {
    console.log("connected to db successfully");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.json({ message: "dummy route" });
});
app.use("/api", registerRoute);
app.use("/api", dashboardRoute);
app.listen(process.env.PORT, () => {
  console.log("Express server started");
});
