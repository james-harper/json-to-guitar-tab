const Pattern = {};

Pattern.desiredLength = constants.BEATS_PER_BAR * 4;

/**
 * Either truncate or pad the pattern so it reaches the appropriate length.
 *
 * @param {string} rhythm A rhythmic pattern
 * @returns {string}
 */
Pattern.fitToBar = rhythm => {
  if (rhythm.length < 1) { rhythm = '-';}

  rhythm = _.repeat(rhythm, Pattern.desiredLength/rhythm.length);

  if (rhythm.length < Pattern.desiredLength) {
    let padLength = Pattern.desiredLength - rhythm.length;
    rhythm += rhythm.substring(0, padLength);
  } else {
    rhythm = rhythm.substring(0,Pattern.desiredLength);
  }

  return rhythm;
}

/**
 * Randomly generate a rhythmic pattern
 *
 * @returns {string} A random pattern
 */
Pattern.random = () => {
  let rhythm = 'x';

  for (let i = 0; i < Pattern.desiredLength - 1; i++) {
    rhythm += (_.random(1) > 0) ? 'x' : '-';
  }

  return rhythm;
}