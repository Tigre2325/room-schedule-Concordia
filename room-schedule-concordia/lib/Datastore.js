"use strict";

//------------------------------------------------------------------------------
// Modules
// Node standard modules
const fs = require("node:fs");

// Third-party modules and packages

// Local modules and packages
const AWS = require("aws-sdk");

//------------------------------------------------------------------------------
// Global variables
const s3 = new AWS.S3();

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

    // try {
    //   fs.accessSync(this.filePath)
    // } catch (err) {
    //   fs.writeFileSync(this.filePath, "[]");
    // }
    // @ts-ignore
    const paramsHead = {
      Bucket: process.env.BUCKET,
      Key: this.filePath,
    };
    // @ts-ignore
    s3.headBucket(paramsHead, (err, data) => {
      if (err) {
        console.log(
          `Creating empty body for bucket with key "${this.filePath}"`
        );

        // Create an empty body
        const paramsPut = {
          Body: "[]",
          Bucket: process.env.BUCKET,
          Key: this.filePath,
        };
        // @ts-ignore
        s3.putObject(paramsPut, (err, data) => {
          if (err) {
            console.log(err, err.stack);
          } else {
            console.log(
              `Successfull creation of empty body for "${this.filePath}"`
            );
            console.log(data);
          }
        });
      } else {
        console.log(`Successfull access to "${this.filePath}"`);
        console.log(data);
      }
    });
  }

  /**
   * Loads the data from the database file in `data`.
   */
  async loadDatabase() {
    try {
      // const fileContents = await fs.promises.readFile(this.filePath, "utf8");
      // @ts-ignore
      const s3File = await s3
        .getObject({
          Bucket: process.env.BUCKET,
          Key: this.filePath,
        })
        .promise();
      // @ts-ignore
      this.data = JSON.parse(s3File.Body);
    } catch (err) {
      console.error(`ERROR in 'loadDatabase()' with ${this.filePath}:`);
      console.error(err);
    }
  }

  /**
   * Overwrite the database file with `data`.
   * @param {object|object[]} data - Data to write in the database file.
   * @returns {Promise} Promise to write the data.
   */
  async writeDatabase(data) {
    const json = JSON.stringify(data);
    // return fs.promises.writeFile(this.filePath, json);
    // @ts-ignore
    return s3
      .putObject({
        Body: json,
        Bucket: process.env.BUCKET,
        Key: this.filePath,
      })
      .promise();
  }

  /**
   * Find records with exact match using filtering system.
   * @param {object} filterProperties - Object containing the properties to filter the data.
   * @returns {Promise<object>} The filtered records.
   */
  async find(filterProperties) {
    if (!typeof this.data) {
      await this.loadDatabase();
    }

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
