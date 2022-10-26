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

//------------------------------------------------------------------------------
// Setting the application
const app = express();

app.use(express.static(path.join(".", "room-schedule-concordia", "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//------------------------------------------------------------------------------
// Global variables

// Models

// Routes
const indexRouter = require("./routes/index");
app.use("/", indexRouter);

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
    console.log({ buildings });
    console.log({ coursesConcordia });
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
