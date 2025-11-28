const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userData = require("../models/User.js");

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
  return { accessToken, refreshToken };
};

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, mobileNumber, address, gender } = req.body;

    //existing user or not
    const existingUser = await userData.findOne({ email });
    console.log(existingUser);
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userData({
      name,
      email,
      password: hashedPassword,
      mobileNumber,
      address,
      gender,
    });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.log("Error while creating", err);
    res.status(500).json({ message: "server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userData.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    const { accessToken, refreshToken } = generateTokens(user);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/",
      secure: false,
      sameSite: "lax",
    });
    res.status(200).json({
      message: "Login successful",
      token: accessToken,
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (err) {
    console.log("Error during login", err);
    res.status(500).json({ message: "server error" });
  }
});

router.get("/refresh-token", async (req, res) => {
  const token = req.cookies.refreshToken;
  console.log("token from refresh token route", token);
  console.log(req.cookies);
  if (!token) return res.status(401).json({ message: "No token appeared" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const foundUser = await userData.findById(decoded.id);
    const newAccessToken = jwt.sign(
      { id: foundUser._id, email: foundUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    res.json({
      accessToken: newAccessToken,
      user: { id: foundUser._id, name: foundUser.name, email: foundUser.email },
    });
  } catch (err) {
    console.log("error from refresh token route", err);
    return res.status(401).json({ message: "invalid refresh token" });
  }
});

router.post("/logout", (req, res) => {
  try {
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "server error" });
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const { _id } = req.body;
    await userData.findByIdAndDelete({ _id });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "error during delete method", err });
  }
});

router.put("/update", async (req, res) => {
  try {
    const { _id, name } = req.body;
    await userData.findByIdAndUpdate({ _id }, { name });
    res.status(200).json({ message: "User data changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "error during put method", err });
  }
});
module.exports = router;
