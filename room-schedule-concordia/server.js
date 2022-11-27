"use strict";

//------------------------------------------------------------------------------
// Modules
// Node standard modules
const path = require("node:path");

// Third-party modules and packages
const express = require("express");

require("dotenv").config({
  path: path.resolve(".", "room-schedule-concordia", "env", ".env"),
});

// Local modules and packages
const concordia = require("./services/concordia");
const { parseCourses } = require("./models/parseCourses");

//------------------------------------------------------------------------------
// Setting the application
const app = express();

app.use(express.static(path.join(".", "room-schedule-concordia", "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//------------------------------------------------------------------------------
// Global variables

// Models
const dbRoom = require("./models/Room");
const dbCourse = require("./models/Course");

// Routes
const indexRouter = require("./routes/index");
app.use("/", indexRouter);
const roomRouter = require("./routes/room");
app.use("/rooms", roomRouter);

//------------------------------------------------------------------------------
// Main

async function main() {
  // TODO: check when was the last time data was retrieved
  // Call to the Concordia api on server start

  try {
    const [buildings, coursesConcordia] = await Promise.all([
      concordia.getBuildingList(),
      concordia.getCourseSchedules(),
    ]);

    // Parse data from the api
    const { rooms, coursesCurrentTerm } = await parseCourses(
      coursesConcordia,
      buildings
    );

    // Initialize `dbRoom`
    await dbRoom.loadDatabase();
    dbRoom.data = rooms;
    await dbRoom.writeDatabase(rooms);

    // Initialize `dbCourse`
    await dbCourse.loadDatabase();
    dbCourse.data = coursesCurrentTerm;
    await dbCourse.writeDatabase(coursesCurrentTerm);
  } catch (err) {
    // TODO: Retry later
    console.error("Could not get buildings and courses");
    console.error(err);
  }
}

app.listen(process.env.PORT, async () => {
  if (process.env.NODE_ENV !== "production") {
    console.log(`Visit http://localhost:${process.env.PORT}`);
  }

  await main();
});
