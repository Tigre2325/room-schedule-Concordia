"use strict";

//------------------------------------------------------------------------------
// Modules
// Node standard modules

// Third-party modules and packages

// Local modules and packages

//------------------------------------------------------------------------------
// Global variables
const { DAY_IN_MS } = require("../utils/constants");
let currentDate = new Date();

//------------------------------------------------------------------------------
// JSDoc types
/**
 * Course object received from the Concordia api.
 * https://opendata.concordia.ca/API/v1/course/schedule/filter/{courseId}/{subject}/{catalog}
 * @typedef {Object} CourseConcordia
 * @property {string} courseID - 6 digit Course Identification Number.
 * @property {string} [termCode] - 4 digit term code.
 * @property {string} [session] - A term can be broken down into separate sessions.
 * @property {string} subject - 4 character subject code (e.g. ENGL, HIST, COMM).
 * @property {string|Number|any} catalog - 3 or 4 digit catalog number.
 * @property {string} section - The specific section letter or number of the scheduled class.
 * @property {string} [componentCode] - 3 character code related to the component type (e.g. LEC, TUT, LAB).
 * @property {string} componentDescription - Description of component code (e.g. Lecture, Tutorial, Laboratory).
 * @property {string} [classNumber] - A 4 or 5 digit number that is unique to each scheduled section within a term.
 * @property {string} [classAssociation] - The class association number links class sections together that are scheduled for the same course within a unique term.
 * @property {string} courseTitle - Title of the course
 * @property {string} [topicID] - If a course is a topic course (meaning it is the same course ID/subject code and catalog # but can have topics that differ for each offering) it will have a topic ID which is a 1 or 2 digit number. Value can be null.
 * @property {string} [topicDescription] - This is the description of the topic that relates to the above topic ID for the course.
 * @property {string} classStatus - Currently we only show 'Active' classes (those available for enrollment).
 * @property {string} locationCode - The campus at which the class is offered.
 * @property {string} [instructionModeCode] - The method of instruction for the class.
 * @property {string} instructionModeDescription - The description of the instruction mode code above.
 * @property {string} [meetingPatternNumber] - A class can have more than one meeting pattern, if for example, the times or days the class if offered change over the term.
 * @property {string} roomCode - This is the overall code for the room that the class is assigned to. It comprises the building code and room number.
 * @property {string} buildingCode - The building code the class is assigned to.
 * @property {string} room - The room number that the class is assigned to.
 * @property {string|Number|any} classStartTime - Class start time.
 * @property {string|Number|any} classEndTime - Class end time.
 * @property {string|boolean} mondays - Mondays.
 * @property {string|boolean} tuesdays - Tuesdays.
 * @property {string|boolean} wednesdays - Wednesdays.
 * @property {string|boolean} thursdays - Thursdays.
 * @property {string|boolean} fridays - Fridays.
 * @property {string|boolean} saturdays - Saturdays.
 * @property {string|boolean} sundays - Sundays.
 * @property {string|Date|any} classStartDate - Date when class starts.
 * @property {string|Date|any} classEndDate - Date when class ends.
 * @property {string} career - Level of study.
 * @property {string} [departmentCode] - 3 to 10 character code for the Department.
 * @property {string} departmentDescription - Description of the above Department Code.
 * @property {string} [facultyCode] - 2 to 4 character code for the Faculty.
 * @property {string} facultyDescription - Description of the above Faculty Code.
 * @property {string} [enrollmentCapacity] - The set capacity of the class – how many students can enroll.
 * @property {string} [currentEnrollment] - Currently how many students are enrolled.
 * @property {string} [waitlistCapacity] - How many students can be on the waitlist.
 * @property {string} [currentWaitlistTotal] - Currently how many students are on the waitlist.
 * @property {string} [hasSeatReserved] - Does this class have seats reserved for students with a certain criteria.
 */

/**
 * Building object received from the Concordia api.
 * https://opendata.concordia.ca/API/v1/facilities/buildinglist/
 * @typedef {Object} Building
 * @property {string} Campus - Three letter code identifying the campus location of the building. (LOY, SGW)
 * @property {string} Building - Two letter code for the building. (EV, GM, SP)
 * @property {string} Building_Name - Name for the building.
 * @property {string} Building_Long_Name - Descriptive name of the building.
 * @property {string} Address - Civic adress of the building.
 * @property {number} Latitude - Decimal degrees (DD) latitude for the building location.
 * @property {number} Longitude - Decimal degrees (DD) longitude for the building location.
 */

/**
 * Room object.
 * @typedef {Object} Room
 * @property {string} locationCode - The campus at which the class is offered.
 * @property {string} buildingCode - The building code the class is assigned to.
 * @property {string} room - The room number that the class is assigned to.
 */

//------------------------------------------------------------------------------
// Functions

/**
 * Change the type of `date` from string to a Date object.
 * @param {string} date - A date with the format `dd/mm/yyy`
 * @returns {Promise<Date>} The date as a Date object
 */
async function parseClassDate(date) {
  const [strDay, strMonth, strYear] = date.split("/");
  const year = Number.parseInt(strYear);
  const month = Number.parseInt(strMonth) - 1;
  const day = Number.parseInt(strDay);

  const dateParsed = new Date(year, month, day);
  return dateParsed;
}

/**
 * Check a course: is it in the current term? Are its class times defined? Is it
 * located in a building? Is the section not cancelled?
 * @param {CourseConcordia} course - A course to check
 * @returns {Promise<boolean>} A boolean indicating if the course is valid
 */
async function checkCourse(course) {
  // Filter out `endTermDate < currentDate || startTermDate < currentDate + 7 days`
  // (to have schedule of next week)
  // TODO: Check if this works with classes that happen on only 1 day
  // TODO: change to use WEEK_IN_MS
  const isCurrentWeek =
    course.classStartDate.getTime() < currentDate.getTime() + 7 * DAY_IN_MS &&
    course.classEndDate.getTime() > currentDate.getTime();

  // Filter out `classStartTime === "00.00.00" & classEndTime === "00.00.00"`
  const isClassTimeDefined =
    course.classStartTime !== "00.00.00" || course.classEndTime !== "00.00.00";

  // Filter out `buildingCode === ""`
  const isBuildingNotEmpty = course.buildingCode !== "";

  // Filter out cancelled sections
  const isSectionNotCanceled =
    course.classStatus.toLowerCase() !== "cancelled section";

  const isCourseValid =
    isCurrentWeek &&
    isClassTimeDefined &&
    isBuildingNotEmpty &&
    isSectionNotCanceled;

  return isCourseValid;
}

/**
 * Delete the properties of a course that are not used by the app.
 * @param {CourseConcordia} course - A course to delete its unused properties.
 */
async function deleteUnusedProperties(course) {
  delete course.termCode;
  delete course.session;
  delete course.componentCode;
  delete course.classNumber;
  delete course.classAssociation;
  delete course.topicID;
  delete course.topicDescription;
  delete course.instructionModeCode;
  delete course.meetingPatternNumber;
  delete course.departmentCode;
  delete course.facultyCode;
  delete course.enrollmentCapacity;
  delete course.currentEnrollment;
  delete course.waitlistCapacity;
  delete course.currentWaitlistTotal;
  delete course.hasSeatReserved;
}

/**
 * Update the data types of `course` to be more relevant.
 * @param {CourseConcordia} course - A course to update the data types.
 * @param {Building[]} buildings - The array of Concordia's building.
 */
async function updateDataTypes(course, buildings) {
  // Course catalog is a number
  course.catalog = Number.parseInt(course.catalog);

  // Update the campus as some courses are `locationCode=ONL` and have a
  // building defined
  for (const building of buildings) {
    if (building.Building === course.buildingCode) {
      course.locationCode = building.Campus;
      break;
    }
  }

  // Change class times to minutes since 12:00 am, e.g. 2 am = 120 and
  // 1:15 pm = 13 * 60 + 15 = 780 + 15 = 795)
  const [classStartHour, classStartMinute] = course.classStartTime.split(".");
  const [classEndHour, classEndMinute] = course.classEndTime.split(".");
  course.classStartTime =
    Number.parseInt(classStartHour) * 60 + Number.parseInt(classStartMinute);
  course.classEndTime =
    Number.parseInt(classEndHour) * 60 + Number.parseInt(classEndMinute);

  // Change the class days to boolean instead of strings
  course.mondays = course.mondays === "Y" ? true : false;
  course.tuesdays = course.tuesdays === "Y" ? true : false;
  course.wednesdays = course.wednesdays === "Y" ? true : false;
  course.thursdays = course.thursdays === "Y" ? true : false;
  course.fridays = course.fridays === "Y" ? true : false;
  course.saturdays = course.saturdays === "Y" ? true : false;
  course.sundays = course.sundays === "Y" ? true : false;
}

//------------------------------------------------------------------------------
// Main

/**
 * Parse `course`: check if it is valid, delete the unused properties,
 * update the data types of the properties.
 * @param {CourseConcordia} course - A course to parse.
 * @param {Building[]} buildings - The array of Concordia's building.
 */
async function parseCourse(course, buildings) {
  // Parse `classStartDate` and `classEndDate` to `Date()` object
  [course.classStartDate, course.classEndDate] = await Promise.all([
    parseClassDate(course.classStartDate),
    parseClassDate(course.classEndDate),
  ]);

  // if course is not valid, go to the next one
  const isCourseValid = await checkCourse(course);
  if (!isCourseValid) return Promise.reject("Course not valid");

  // Delete data that are not needed
  await deleteUnusedProperties(course);

  // Parse the data into correct objects
  await updateDataTypes(course, buildings);

  return course;
}

/**
 * Create a room object and stringify it so it is not added to the set if it
 * was already in it.
 * @param {CourseConcordia} course - A course from which a room is added.
 * @returns {Promise<string>} The room as JSON
 */
async function addToRoomSet(course) {
  /** @type {Room} */
  const room = {
    locationCode: course.locationCode,
    buildingCode: course.buildingCode,
    room: course.room,
  };

  return JSON.stringify(room);
}

/**
 * Parse `courses`: check if they are valid, delete the unused properties,
 * update the data types of the properties. Create a set of rooms based on
 * `courses` and `buildings`.
 * @param {CourseConcordia[]} courses - The array of Concordia's courses.
 * @param {Building[]} buildings - The array of Concordia's building.
 * @returns {Promise<object>} Object with the rooms and courses offered in the current term.
 */
async function parseCourses(courses, buildings) {
  currentDate = new Date();

  let coursesCurrentTerm = [];
  let roomSet = new Set();

  try {
    const promisesCoursesCurrentTerm = await Promise.allSettled(
      courses.map(async (course) => {
        return await parseCourse(course, buildings);
      })
    );
    promisesCoursesCurrentTerm.forEach((promise) => {
      if (promise.status === "fulfilled") {
        coursesCurrentTerm.push(promise.value);
      }
    });

    const promisesRoomSet = await Promise.allSettled(
      courses.map(async (course) => {
        return await addToRoomSet(course);
      })
    );
    promisesRoomSet.forEach((promise) => {
      if (promise.status === "fulfilled") {
        roomSet.add(promise.value);
      }
    });
  } catch (err) {
    console.error(err);
  }

  const rooms = [];
  roomSet.forEach((room) => rooms.push(JSON.parse(room)));

  return { rooms, coursesCurrentTerm };
}

module.exports = { parseCourses };
