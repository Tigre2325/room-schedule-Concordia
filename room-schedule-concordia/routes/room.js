"use strict";

//------------------------------------------------------------------------------
// Modules
// Node standard modules

// Third-party modules and packages
const express = require("express");

// Local modules and packages
const arrayFunctions = require("../utils/arrayFunctions");

//------------------------------------------------------------------------------
// Global variables
const router = express.Router();

// Model
const dbRoom = require("../models/Room");
const dbCourse = require("../models/Course");

//------------------------------------------------------------------------------
// Functions

/**
 * Build the room object needed for the dependent dropdowns of the client.
 * @param dbRoom - Database of the rooms which is a Room(Datastore) instance.
 * @returns {Promise<object>} Object containing the rooms in this form:
 * ``` json
 * {
 *   "campus1": {
 *     "building1": ["building1Room1", "building1Room2"],
 *     "building2": ["building2Room1", "building2Room2", "building2Room3"]
 *   },
 *   "campus2": {
 *     "building3": ["building3Room1", "building3Room2"],
 *     "building4": ["building4Room1"],
 *     "building5": ["building5Room1", "building5Room2", "building5Room3"]
 *   }
 * }
 * ```
 */
async function returnRoomsObj(dbRoom) {
  const roomsObj = {};
  const locationCodes = arrayFunctions.uniqueValues(
    dbRoom.data,
    "locationCode"
  );
  for (const locationCode of locationCodes) {
    roomsObj[locationCode] = {};

    const roomsInLocation = await dbRoom.find({
      locationCode: locationCode,
    });
    const buildingCodes = arrayFunctions.uniqueValues(
      roomsInLocation,
      "buildingCode"
    );

    for (const buildingCode of buildingCodes) {
      const roomsInBuilding = await dbRoom.find({
        locationCode: locationCode,
        buildingCode: buildingCode,
      });
      roomsObj[locationCode][buildingCode] = arrayFunctions.uniqueValues(
        roomsInBuilding,
        "room"
      );
    }
  }
  return roomsObj;
}

//------------------------------------------------------------------------------
// Main

// All rooms route
router.get("/", async (req, res) => {
  try {
    const roomsObj = await returnRoomsObj(dbRoom);
    res.send(roomsObj);
  } catch (err) {
    console.error("ERROR in GET /room");
    console.error(err);
    res.status(404);
  }
});

// Individual room route
router.post("/room", async (req, res) => {
  const searchOptions = {};

  searchOptions.locationCode = req.body.locationCode;
  searchOptions.buildingCode = req.body.buildingCode;
  searchOptions.room = req.body.room;
  try {
    const courses = await dbCourse.find(searchOptions);
    res.send(courses);
  } catch {
    res.status(404);
  }
});

module.exports = router;
