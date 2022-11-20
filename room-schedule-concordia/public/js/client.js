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

//------------------------------------------------------------------------------
// Functions

/**
 * Get all the rooms from the server
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
 * Sets-up the from dropdowns dynamically
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

/**
 * Posts the selected room and retrieves the courses of that room.
 * @param {string} locationCode - The selected campus.
 * @param {string} buildingCode - The selected building.
 * @param {string} room - The selected room.
 * @returns {Promise<object>} The courses of the selected room.
 */
async function postSelectedRoom(locationCode, buildingCode, room) {
  if (locationCode === null || locationCode === "") {
    alert("Please select a campus, a building and a room.");
    return Promise.reject("No campus selected.");
  } else if (buildingCode === null || buildingCode === "") {
    alert("Please select a building and a room.");
    return Promise.reject("No building selected.");
  } else if (room === null || room === "") {
    alert("Please select a room.");
    return Promise.reject("No room selected.");
  }

  const selectedRoom = {
    locationCode,
    buildingCode,
    room,
  };

  try {
    // @ts-ignore
    const res = await axios.post("/rooms/room", selectedRoom);
    const courses = res.data;
    return courses;
  } catch (err) {
    console.log(err);
  }
}

//------------------------------------------------------------------------------
// Main

// window.onload = async function () {
//   const roomsObj = await getRooms();
//   console.log({ roomsObj });

//   await setupFormDropdowns(roomsObj);
// };

formRoom.onsubmit = async function (ev) {
  ev.preventDefault();

  const formData = new FormData(formRoom);
  const locationCode = formData.get("locationCode");
  const buildingCode = formData.get("buildingCode");
  const room = formData.get("room");

  try {
    // @ts-ignore
    const courses = await postSelectedRoom(locationCode, buildingCode, room);
    console.log({ courses });
  } catch (err) {
    console.error(err);
    // TODO: show an error message in the browser
  }
};
