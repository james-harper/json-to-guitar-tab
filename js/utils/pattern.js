/**
 * Either truncate or pad the pattern so it reaches the appropriate length.
 *
 * @param {string} pattern A rhythmic pattern
 * @returns {string}
 */
function makePatternFitBar(pattern) {
  if (pattern.length < 1) { pattern = '-';}

  let desiredPatternLength = constants.BEATS_PER_BAR * 4;
  pattern = _.repeat(pattern, desiredPatternLength/pattern.length);

  if (pattern.length < desiredPatternLength) {
    let padLength = desiredPatternLength - pattern.length;
    pattern += pattern.substring(0, padLength);
  } else {
    pattern = pattern.substring(0,desiredPatternLength);
  }

  return pattern;
}

/**
 * Randomly generate a rhythmic pattern
 * @returns {string} A random pattern
 */
function makeRandomPattern() {
  let desiredPatternLength = constants.BEATS_PER_BAR * 4;
  let pattern = 'x';

  for (let i = 0; i < desiredPatternLength - 1; i++) {
    pattern += (_.random(1) > 0) ? 'x' : '-';
  }

  return pattern;
}