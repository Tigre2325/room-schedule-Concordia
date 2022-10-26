"use strict";

//------------------------------------------------------------------------------
// Modules
// Node standard modules
const path = require("node:path");

// Third-party modules and packages
const express = require("express");

// Local modules and packages

//------------------------------------------------------------------------------
// Global variables
const app = express();

// Models

// Routes
const indexRouter = require("./routes/index");

//------------------------------------------------------------------------------
// Functions

//------------------------------------------------------------------------------
// Main

// Setting the application
app.use(express.static(path.join(".", "room-schedule-concordia", "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/", indexRouter);

app.listen(process.env.PORT, () => {
  console.log(`Visit http://localhost:${process.env.PORT}`);
});
