"use strict";

//------------------------------------------------------------------------------
// Global variables

// HTML Elements
/**
 * The table with the room schedule.
 * @type HTMLTableElement
 */
// @ts-ignore
const tableRoomSchedule = document.getElementById("week-schedule");

const daysShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const daysLong = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const rowsPerHour = 4;

//------------------------------------------------------------------------------
// JSDoc types
/**
 * Course object received from the Concordia api.
 * https://opendata.concordia.ca/API/v1/course/schedule/filter/{courseId}/{subject}/{catalog}
 * @typedef {Object} CourseConcordia
 * @property {string} subject - 4 character subject code (e.g. ENGL, HIST, COMM).
 * @property {string|Number|any} catalog - 3 or 4 digit catalog number.
 * @property {string} section - The specific section letter or number of the scheduled class.
 * @property {string} componentDescription - Description of component code (e.g. Lecture, Tutorial, Laboratory).
 * @property {string} courseTitle - Title of the course
 * @property {string} locationCode - The campus at which the class is offered.
 * @property {string} room - The room number that the class is assigned to.
 * @property {string} buildingCode - The building code the class is assigned to.
 * @property {string|Number|any} classStartTime - Class start time.
 * @property {string|Number|any} classEndTime - Class end time.
 * @property {string|boolean} mondays - Mondays.
 * @property {string|boolean} tuesdays - Tuesdays.
 * @property {string|boolean} wednesdays - Wednesdays.
 * @property {string|boolean} thursdays - Thursdays.
 * @property {string|boolean} fridays - Fridays.
 * @property {string|boolean} saturdays - Saturdays.
 * @property {string|boolean} sundays - Sundays.
 * @property {string} career - Level of study.
 * @property {string} departmentDescription - Description of the above Department Code.
 * @property {string} facultyDescription - Description of the above Faculty Code.
 */

//------------------------------------------------------------------------------
// Functions

/**
 *
 * @param {HTMLTableElement} table
 */
async function generateTableHeader(table) {
  const colGroup = document.createElement("colgroup");
  table.appendChild(colGroup);

  const tableHeader = table.createTHead();
  const rowHeader = tableHeader.insertRow();

  const COLS = 1 + daysShort.length;

  for (let i = 0; i < COLS; i++) {
    const columnTitle = rowHeader.insertCell();

    if (!i) {
      const col = document.createElement("col");
      colGroup.append(col);
      col.className = "time";
      columnTitle.outerHTML = "<th></th>";
      // columnTitle.className = "td-time";
      continue;
    } else if (i === 1) {
      const col = document.createElement("col");
      colGroup.append(col);
      col.className = "week";
      col.span = 5;
    } else if (i === 6) {
      const col = document.createElement("col");
      colGroup.append(col);
      col.className = "weekend";
      col.span = 2;
    }

    columnTitle.outerHTML = `<th class="day ${daysShort[i - 1]}">${
      daysShort[i - 1]
    }</th>`;
    // columnTitle.className = `td-day ${daysShort[i - 1]}`;
  }
}

/**
 *
 * @param {HTMLTableElement} table
 * @param {number} dayStart
 * @param {number} dayEnd
 */
async function generateTableBody(table, dayStart = 7, dayEnd = 24) {
  const ROWS = Math.round((dayEnd - dayStart) * rowsPerHour);
  const COLS = 1 + daysShort.length;

  const tableBody = table.createTBody();

  for (let i = 0; i < ROWS; i++) {
    const row = tableBody.insertRow();

    const hours = dayStart + Math.floor(i / rowsPerHour);
    // const hoursStr = hours < 10 ? `0${hours}` : `${hours}`;

    const minutes = (i % rowsPerHour) * Math.round(60 / rowsPerHour);
    // const minutesStr = minutes === 0 ? "00" : `${minutes}`;

    row.className = `hour ${hours}`;
    row.id = `${hours}-${minutes}`;

    // Generate all the cells of the row
    for (let j = 0; j < COLS; j++) {
      // Do not add a cell in the time colum and in the row of minutes
      // other than 0
      if (!j && minutes) continue;

      const cell = row.insertCell();

      // Column time
      if (!j) {
        cell.rowSpan = 4;
        cell.className = "time-hour";
        const span = document.createElement("span");
        span.textContent = `${hours}:00`;
        cell.appendChild(span);
        continue;
      }

      cell.className = `day ${daysShort[j - 1].toLowerCase()}`;
      cell.id = `${daysShort[j - 1].toLowerCase()}-${hours}-${minutes}`;
    }
  }
}

async function generateTableRoomSchedule() {
  await generateTableHeader(tableRoomSchedule);
  await generateTableBody(tableRoomSchedule);
}

/**
 * Parse the number of minutes since 12:00am as hours and minutes.
 *
 * Returned minutes are rounded to  precision of `60 / rowsPerHour`, eg.
 * if `rowsPerHour` is 4 (default value), then the returned minutes are
 * rounded to 0, 15, 30, or 45.
 *
 * @param {number} classTime - Time as the number of minutes since 12:00am.
 * @returns {Promise<object>} Time splitted in hours and minutes.
 */
async function parseMinutesToTime(classTime) {
  const minutes = classTime % 60;
  const nMinutesGroup = Math.round((minutes * rowsPerHour) / 60);
  const minutesRounded = Math.round((nMinutesGroup * 60) / rowsPerHour);

  const time = {
    hours: Math.floor(classTime / 60),
    minutes: minutesRounded,
  };

  return time;
}

/**
 *
 * @param {CourseConcordia} course
 */
async function displayCourse(course) {
  const startTime = await parseMinutesToTime(course.classStartTime);
  const endTime = await parseMinutesToTime(course.classEndTime);

  for (let i = 0; i < daysShort.length; i++) {
    const dayProperty = `${daysLong[i].toLowerCase()}s`;

    if (!course[dayProperty]) continue;

    const startMinutes = startTime.hours * 60 + startTime.minutes;
    const endMinutes = endTime.hours * 60 + endTime.minutes;

    const rowSpan = Math.round(
      ((endMinutes - startMinutes) * rowsPerHour) / 60
    );

    /**
     * @type HTMLTableCellElement
     */
    // @ts-ignore
    const cell = document.getElementById(
      `${daysShort[i].toLowerCase()}-${startTime.hours}-${startTime.minutes}`
    );
    cell.rowSpan = rowSpan;
    cell.innerHTML = `<span>${course.subject} ${course.catalog}</span>`;
    cell.classList.add("course");

    for (let j = 1; j < rowSpan; j++) {
      const removeMinutes =
        startTime.hours * 60 + startTime.minutes + (j * 60) / rowsPerHour;
      const removeTime = await parseMinutesToTime(removeMinutes);
      const removeCell = document.getElementById(
        `${daysShort[i].toLowerCase()}-${removeTime.hours}-${
          removeTime.minutes
        }`
      );

      removeCell?.remove();
    }
  }
}
