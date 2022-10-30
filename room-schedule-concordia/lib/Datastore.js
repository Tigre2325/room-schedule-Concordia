"use strict";

//------------------------------------------------------------------------------
// Modules
// Node standard modules
const fs = require("node:fs");

// Third-party modules and packages

// Local modules and packages

//------------------------------------------------------------------------------
// Global variables

//------------------------------------------------------------------------------
// Functions

//------------------------------------------------------------------------------
// Main

/**
 * Stores data as json in the file system
 */
class Datastore {
  /**
   * Creates a database and its file if needed.
   * @param {string} filePath - Path in which the data will be stored.
   * @throws {Error} If `filePath` is not specified.
   */
  constructor(filePath) {
    if (!filePath) {
      throw new Error("'filePath' is required to create a new Datastore!");
    }

    this.filePath = filePath;

    try {
      fs.accessSync(this.filePath);
    } catch (err) {
      fs.writeFileSync(this.filePath, "[]");
    }
  }

  /**
   * Loads the data from the database file in `data`.
   */
  async loadDatabase() {
    try {
      const fileContents = await fs.promises.readFile(this.filePath, "utf8");
      this.data = JSON.parse(fileContents);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Overwrite the database file with `data`.
   * @param {object|object[]} data - Data to write in the database file.
   * @returns {Promise} Promise to write the data.
   */
  async writeDatabase(data) {
    const json = JSON.stringify(data, null, 2);
    return fs.promises.writeFile(this.filePath, json);
  }

  /**
   * Find records with exact match using filtering system.
   * @param {object} filterProperties - Object containing the properties to filter the data.
   * @returns {Promise<object>} The filtered records.
   */
  async find(filterProperties) {
    const filteredRecords = this.data.filter((record) => {
      // Assume the record is found
      let found = true;

      // Check all properties of `object`
      for (const property in filterProperties) {
        // if `property` is not in `record` or `object[property]` is different
        // from `record[property]`, then `record` was not found
        if (
          !(property in record) ||
          filterProperties[property] !== record[property]
        ) {
          found = false;
          break;
        }
      }

      return found;
    });

    return filteredRecords;
  }
}

module.exports = Datastore;
