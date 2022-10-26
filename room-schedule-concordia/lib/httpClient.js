"use strict";

//------------------------------------------------------------------------------
// Modules
// Node standard modules

// Third-party modules and packages
const axios = require("axios").default;

// Local modules and packages

//------------------------------------------------------------------------------
// Functions

/**
 * Facade function for a get request.
 * @param {string} url - The request url
 * @param {object} params - The request parameters
 * @returns {Promise}
 */
async function get(url, params) {
  return await axios.get(url, params);
}

/**
 * Facade function for a post request.
 * @param {string} url - The request url
 * @param {object} data - The request parameters
 * @returns {Promise}
 */
async function post(url, data) {
  return await axios.post(url, data);
}

module.exports = {
  get,
  post,
};
