"use strict";

//------------------------------------------------------------------------------
// Modules
// Node standard modules
const path = require("node:path");

// Third-party modules and packages

// Local modules and packages

//------------------------------------------------------------------------------
// Functions

//------------------------------------------------------------------------------
// Main

// models
/**
 * Number of milliseconds in a day.
 */
const DAY_IN_MS = 24 * 60 * 60 * 1000;

/**
 * Path to the data directory.
 */
const PATH_DATA_DIR = path.join(".", "room-schedule-concordia", "data");

module.exports = {
  DAY_IN_MS,
  PATH_DATA_DIR,
};
