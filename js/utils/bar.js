const Bar = {};

/**
 * Render a bar of tablature for a single string
 *
 * @param {string[]} chords The chords that should be drawn in this bar
 * @param {string} string The guitar string that is being drawn
 * @param {string} pattern The rhythm that should be drawn
 * @param {number} index Used to check if bar is at the start of a new line
 */
Bar.draw = (chords, string, pattern, index) => {
  pattern = Pattern.fitToBar(pattern);

  let note = '-';
  let output = '';

  if (index % constants.BEATS_PER_BAR === 0) {
    output += string + '|';
  }

  let multiplier = 1;
  let currentChord = 0;

  for (let i = 0; i < pattern.length; i++) {
    let cutoff = Math.ceil(pattern.length / chords.length)

    if (i >= cutoff * multiplier) {
      currentChord++;
      multiplier++;
    }

    let chord = chords[currentChord];

    switch (string) {
      case strings.e: note = chord[5]; break;
      case strings.B: note = chord[4]; break;
      case strings.G: note = chord[3]; break;
      case strings.D: note = chord[2]; break;
      case strings.A: note = chord[1]; break;
      case strings.E: note = chord[0]; break;
    }

    // Use hex to represent higher frets
    if (!['x', 'X', '-'].includes(note)) {
      note = parseInt('0x'+note, 16);
    }

    if (!Note.isValid(note)) {
      note = '-'
    }

    let dontOutput = (
      (note >= 10 && pattern[i-1] !== '-') && (pattern[i-1] !== undefined)
    );

    if (!dontOutput) {
      output += (pattern[i] !== '-') ? note : '-';
    }
  }

  output += '|';

  return output;
}