const Helpers = {};

/**
 * @param {string} json
 * @returns {string} Pretty printed json
 */
Helpers.prettyPrint = json => JSON.stringify(JSON.parse(json), null, 2);
