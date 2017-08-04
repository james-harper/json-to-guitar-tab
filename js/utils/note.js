/**
 * Convert sharps to the appropriate flat key
 * to make lookups simpler
 */
function convertAccidental(key) {
  if (key.length === 1) { return _.toUpper(key); }

  let converted = _.toUpper(key.charAt(0));
  if (key.charAt(1) === '#') {
    converted = String.fromCharCode(converted.charCodeAt() + 1)
    key = (converted < 'H') ? converted : 'A';

    if (!['C', 'F'].includes(key)) {
      key += 'b';
    }
  }

  return key;
};

/**
 * Check if the supplied character is valid
 */
function isValid(note) {
  if (note === 'x' || note === 'X') return true;
  if (note === '-') return true;
  if (isNaN(note)) return false;
  if (_.isNumber(note)) return true;
  if (['a', 'b', 'c', 'd', 'e', 'f'].includes(note.toLowerCase())) return true;

  return false;
}