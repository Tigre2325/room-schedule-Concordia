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

class Course extends Datastore {
  constructor() {
    super("data/course.db");
  }
  /**
   * Loads the data from the database file in `this.data`.
   */
  async loadDatabase() {
    await super.loadDatabase();
    this.data.classStartDate = new Date(this.data.classStartDate);
    this.data.classEndDate = new Date(this.data.classEndDate);
  }
}

const dbCourse = new Course();

module.exports = dbCourse;

/* Course schema
//: data not needed
!!: data to change
{
  "courseID": "009966",
  // "termCode": "2221",
  // "session": "6H2",
  "subject": "ENGR",
  !! number "catalog": "244",
  "section": "CC",
  // "componentCode": "LEC",
  "componentDescription": "Lecture",
  // "classNumber": "3591",
  // "classAssociation": "2",
  "courseTitle": "MECHANICS OF MATERIALS",
  // "topicID": ",
  // "topicDescription": ",
  "classStatus": "Active",
  !! change using other data "locationCode": "SGW",
  // "instructionModeCode": "P",
  "instructionModeDescription": "In Person",
  // "meetingPatternNumber": "1",
  "roomCode": "H520",
  "buildingCode": "H",
  "room": "520",
  !! number of minutes since 0:00 "classStartTime": "14.45.00",
  !! number of minutes since 0:00 "classEndTime": "17.15.00",
  !! boolean "mondays": "Y",
  !! boolean "tuesdays": "N",
  !! boolean "wednesdays": "Y",
  !! boolean "thursdays": "N",
  !! boolean "fridays": "N",
  !! boolean "saturdays": "N",
  !! boolean "sundays": "N",
  !! date "classStartDate": "23\/06\/2022",
  !! date "classEndDate": "08\/08\/2022",
  "career": "Undergraduate",
  // "departmentCode": "CENTENGIN",
  "departmentDescription": "Centre for Engineer in Society",
  // "facultyCode": "ENCS",
  "facultyDescription": "Gina Cody School of Engineering & Computer Science",
  // "enrollmentCapacity": "90",
  // "currentEnrollment": "83",
  // "waitlistCapacity": "10",
  // "currentWaitlistTotal": "0",
  // "hasSeatReserved": "Y"
}
*/
