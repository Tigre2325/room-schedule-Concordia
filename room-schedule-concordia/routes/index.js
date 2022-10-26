"use strict";

//------------------------------------------------------------------------------
// Modules
// Node standard modules

// Third-party modules and packages
const express = require("express");

// Local modules and packages

//------------------------------------------------------------------------------
// Global variables
const router = express.Router();

//------------------------------------------------------------------------------
// Functions

//------------------------------------------------------------------------------
// Main

router.get("/", (req, res) => {
  res.send("Hello World from index.js route!");
});

module.exports = router;
