"use strict";

//------------------------------------------------------------------------------
// Modules
// Node standard modules

// Third-party modules and packages

// Local modules and packages

//------------------------------------------------------------------------------
// Global variables

//------------------------------------------------------------------------------
// Functions

/**
 * Get the unique values of an array of objects based on a property of that object.
 * @param {object[]} arrObj - Array of objects to get the unique values from.
 * @param {string} property - Property of the objects to get the unique values from.
 * @returns {Array} Unique values of ``arrObj`` based on ``property``.
 */
function uniqueValues(arrObj, property) {
  // Get an array containing just the propery values
  const propertyValues = arrObj.map((obj) => obj[property]);

  // Create a unique list of values and sort them
  const uniqueValues = [...new Set(propertyValues)].sort();

  return uniqueValues;
}

module.exports = { uniqueValues };
