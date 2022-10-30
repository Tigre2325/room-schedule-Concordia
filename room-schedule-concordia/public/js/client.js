"use strict";

//------------------------------------------------------------------------------
// Global variables

// HTML Elements
/**
 * The form to get the room.
 * @type {HTMLFormElement}
 */
// @ts-ignore
const formRoom = document.forms["form-room"];
/**
 * The campus dropdown.
 * @type {HTMLSelectElement}
 */
// @ts-ignore
const dropdownCampus = document.getElementById("dropdown-campus");
/**
 * The building dropdown.
 * @type {HTMLSelectElement}
 */
// @ts-ignore
const dropdownBuilding = document.getElementById("dropdown-building");
/**
 * The room dropdown.
 * @type {HTMLSelectElement}
 */
// @ts-ignore
const dropdownRoom = document.getElementById("dropdown-room");

//------------------------------------------------------------------------------
// Functions

async function getRooms() {
  try {
    // @ts-ignore
    const res = await axios.get("/rooms");
    const roomsObj = res.data;
    return roomsObj;
  } catch (err) {
    console.error(err);
  }
}

/**
 * Setup the from dropdowns dynamically
 * @param {object} roomsObj - Object containing the rooms in this form:
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
 *   },
 * }
 * ```
 */
async function setupFormDropdowns(roomsObj) {
  for (let campus in roomsObj) {
    dropdownCampus.options[dropdownCampus.options.length] = new Option(
      campus,
      campus
    );
  }

  dropdownCampus.onchange = async function () {
    // Empty dropdownBuilding and dropdownBuilding
    dropdownBuilding.length = 1;
    dropdownRoom.length = 1;

    //Display correct values
    for (let building in roomsObj[dropdownCampus.value]) {
      dropdownBuilding.options[dropdownBuilding.options.length] = new Option(
        building,
        building
      );
    }
  };

  dropdownBuilding.onchange = async function () {
    // Empty dropdownBuilding
    dropdownRoom.length = 1;

    //Display correct values
    const room = roomsObj[dropdownCampus.value][dropdownBuilding.value];
    for (let i = 0; i < room.length; i++) {
      dropdownRoom.options[dropdownRoom.options.length] = new Option(
        room[i],
        room[i]
      );
    }
  };
}

//------------------------------------------------------------------------------
// Main

window.onload = async function () {
  const roomsObj = await getRooms();
  console.log({ roomsObj });

  await setupFormDropdowns(roomsObj);
};
