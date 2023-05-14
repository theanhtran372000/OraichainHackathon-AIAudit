const express = require("express");
const { callContract } = require("../service/contract");
const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    // Call Contract
    const data = req.body;
    const response = await callContract(data);
    res.send(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
