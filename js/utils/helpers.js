const Helpers = {};

/**
 * Character helper functions
 */
Helpers.Character = {};

/**
 * @param {string} char
 * @returns {string} The next character. Eg A => B
 */
Helpers.Character.next =
  char => String.fromCharCode(char.charCodeAt() + 1);

/**
 * @param {string} char
 * @returns {string} The previous character. Eg B => A
 */
Helpers.Character.previous =
  char => String.fromCharCode(char.charCodeAt() - 1);

  /**
 * JSON Helper functions
 */
Helpers.JSON = {};

/**
 * @param {string} json
 * @returns {string} Pretty printed json
 */
Helpers.JSON.prettyPrint =
  json => JSON.stringify(JSON.parse(json), null, 2);
