/**
 * Normalise notes to simplify lookups. Sharps will be converted to flats.
 *
 * @param {string} note
 * @returns {string} The converted note
 */
function convertAccidental(note) {
  if (note.length === 1) { return _.toUpper(note); }

  let converted = _.toUpper(note.charAt(0));
  if (note.charAt(1) === '#') {
    converted = String.fromCharCode(converted.charCodeAt() + 1)
    note = (converted < 'H') ? converted : 'A';

    if (!['C', 'F'].includes(note)) {
      note += 'b';
    }
  }

  return note;
};

/**
 * Check if the supplied character is valid.
 * 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, a, b, c, d, e, f, -, and x are permitted.
 *
 * @param {string} note
 * @returns {boolean}
 */
function isValid(note) {
  if (note === 'x' || note === 'X') return true;
  if (note === '-') return true;
  if (isNaN(note)) return false;
  if (_.isNumber(note)) return true;
  if (['a', 'b', 'c', 'd', 'e', 'f'].includes(note.toLowerCase())) return true;

  return false;
}