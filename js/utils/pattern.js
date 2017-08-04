/**
 * Handle pattern padding and truncating
 * to fit the desired length
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
 */
function makeRandomPattern() {
  let desiredPatternLength = constants.BEATS_PER_BAR * 4;
  let pattern = 'x';

  for (let i = 0; i < desiredPatternLength - 1; i++) {
    pattern += (_.random(1) > 0) ? 'x' : '-';
  }

  return pattern;
}