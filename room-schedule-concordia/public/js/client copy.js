"use strict";

//------------------------------------------------------------------------------
// Global variables

// HTML Elements
/**
 * The form to get the room.
 * @type {HTMLFormElement}
 */
const formRoom = document.forms["form-room"];
/**
 * The campus dropdown.
 * @type {HTMLSelectElement}
 */
const dropdownCampus = document.getElementById("dropdown-campus");
/**
 * The building dropdown.
 * @type {HTMLSelectElement}
 */
const dropdownBuilding = document.getElementById("dropdown-building");
/**
 * The room dropdown.
 * @type {HTMLSelectElement}
 */
const dropdownRoom = document.getElementById("dropdown-room");

//------------------------------------------------------------------------------
// Functions
/*
// GET
async function getUser() {
  try {
    const res = await axios.get(URL);
    console.log(res);
  } catch (error) {
    console.error(error);
  }
}

// POST
async function postUser() {
  const data = {
    firstName: "Fred",
    lastName: "Flintstone",
  };
  try {
    const res = await axios.post("/user", data);
    console.log(res);
  } catch (error) {
    console.log(error);
  }
}
*/
async function getRooms() {
  try {
    const res = await axios.get("/rooms");
    const roomsObj = res.data;
    return roomsObj;
  } catch (error) {
    console.error(error);
  }
}

async function postSelectedRoom() {
  const formData = new FormData(formRoom);

  const locationCode = formData.get("locationCode");
  const buildingCode = formData.get("buildingCode");
  const room = formData.get("room");

  if (locationCode === null || locationCode === "") {
    alert("Please select a campus,a building and a room.");
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
    const res = await axios.post("/rooms/room", selectedRoom);
    const courses = res.data;
    return courses;
  } catch (err) {
    console.log(err);
  }
}

/**
 * Setup the from dropdowns dynamically
 * @param {string} roomsObj - Object containing the rooms in this form:
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
  console.log(roomsObj);

  await setupFormDropdowns(roomsObj);

  formRoom.onsubmit = async function (ev) {
    ev.preventDefault();

    try {
      const courses = await postSelectedRoom();
      console.log(courses);
    } catch (err) {
      console.error(err);
      // TODO: show an error message in the browser
    }
  };
};
