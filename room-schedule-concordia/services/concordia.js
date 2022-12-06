"use strict";

//------------------------------------------------------------------------------
// Modules
// Node standard modules

// Third-party modules and packages

// Local modules and packages
const httpClient = require("../lib/httpClient");

//------------------------------------------------------------------------------
// Global variables
/**
 * Base url of the Concordia api.
 */
const API_BASE_URL =
  process.env.NODE_ENV !== "development"
    ? "https://opendata.concordia.ca/API/v1/"
    : "http://localhost:3001/API/v1/";

// const API_KEY = Buffer.from(`${USER}:${PASSWORD}`).toString("base64");
// const auth = { Authorization: `Basic ${API_KEY}` };
const auth = {
  username: process.env.USER,
  password: process.env.PASSWORD,
};

//------------------------------------------------------------------------------
// Functions

//------------------------------------------------------------------------------
// Main

/**
 * Get the building list from the Concordia api.
 * @returns {Promise<object>}
 */
async function getBuildingList() {
  const endPoint = "facilities/buildinglist/";
  const apiUrl = API_BASE_URL + endPoint;
  try {
    const res = await httpClient.get(apiUrl, { auth: auth });
    const buildings = res.data;
    return buildings;
  } catch (error) {
    console.error(error);
    return Promise.reject("Could not get buildinglist.");
  }
}

/**
 * Get the course schedules from the Concordia api.
 * @param {string|number} termCode - 4 digit term code.
 * @param {string} [subject="*"] - 4 character subject code (e.g. ENGL, HIST, COMM).
 * @returns {Promise<object>}
 */
async function getCourseSchedules(termCode, subject = "*") {
  subject.toString();
  const endPoint = `course/scheduleTerm/filter/${subject}/${termCode}`;
  const apiUrl = API_BASE_URL + endPoint;
  try {
    const res = await httpClient.get(apiUrl, { auth: auth });
    const coursesConcordia = res.data;
    return coursesConcordia;
  } catch (error) {
    console.error(error);
    return Promise.reject("Could not get course schedules.");
  }
}

module.exports = { getBuildingList, getCourseSchedules };
