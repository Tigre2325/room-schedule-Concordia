"use strict";

//------------------------------------------------------------------------------
// Modules
// Node standard modules

// Third-party modules and packages

// Local modules and packages
const Datastore = require("../lib/Datastore");

//------------------------------------------------------------------------------
// Global variables

//------------------------------------------------------------------------------
// Functions

//------------------------------------------------------------------------------
// Main

class Room extends Datastore {
  constructor() {
    super("data/room.db");
  }
}

const dbRoom = new Room();

module.exports = dbRoom;
