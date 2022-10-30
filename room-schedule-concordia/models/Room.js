"use strict";

//------------------------------------------------------------------------------
// Modules
// Node standard modules
const path = require("node:path");

// Third-party modules and packages

// Local modules and packages
const Datastore = require("../lib/Datastore");

//------------------------------------------------------------------------------
// Global variables
const { PATH_DATA_DIR } = require("../utils/constants");

//------------------------------------------------------------------------------
// Functions

//------------------------------------------------------------------------------
// Main

class Room extends Datastore {
  constructor() {
    super(path.join(PATH_DATA_DIR, "room.db"));
  }
}

const dbRoom = new Room();

module.exports = dbRoom;
