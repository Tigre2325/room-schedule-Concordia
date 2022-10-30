"use strict";

//------------------------------------------------------------------------------
// Global variables

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

//------------------------------------------------------------------------------
// Main

window.onload = async function () {
  const roomsObj = await getRooms();
  console.log({ roomsObj });
};
