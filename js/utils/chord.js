const Chord = {};

/**
 * Find the name of a chord from its shape.
 *
 * @param {string} target The chord shape that is being matched against a name. Eg '-32010'
 * @returns {string} Either the name of the chord or '?' if no match was found.
 */
Chord.findByShape = target => {
  let result = '?';

  _(chordMap).each((chords,root) => {
    _(chords).each((chord, tonality) => {
      if (chord.length) {
        _(chord).each(shape => {
          if (shape === target) {
            return result = root + ' ' + tonality;
          }
        })
      }
    })
  });

  return result;
};

/**
 * Find chord shape from its name.
 *
 * @param {string} name The name of the chord. Eg D major
 * @returns {string[]} Any shapes that match the given name
 */
Chord.findByName = name => {
  let splitBy = '_';
  let root;
  let tonality;

  name = name.replace(/\s/g, splitBy).toLowerCase();

  _(supportedChords).each(ext => {
    if (name.includes(ext)) {
      name = name.replace(splitBy, '');
      root = name.split(ext)[0];
      tonality = ext;
    }
  });

  if (!root && !tonality) {
    [root, tonality] = name.split(splitBy);
  }

  if (tonality === undefined) {
    tonality = 'major';
  }

  root = Note.convertAccidental(root);
  return chordMap[root][tonality];
};

/**
 * Determine whether a chord has been passed by name
 * (As opposed to shape)
 *
 * @param {string} chord
 * @returns {boolean}
 */
Chord.isNamed = chord => {
  let match = false;

  supportedChords.forEach(ext => {
    if (ext.length === 1) {
      ext = ' ' + ext;
    }

    if (chord.includes(ext)) {
      match = true
    }
  });

  return match;
}

/**
 * @param {string} chord Accepts either a name or a shape
 * @returns {string}
 */
Chord.find = chord => {
  if (Chord.isNamed(chord)) {
    let shapes = Chord.findByName(chord);
    return (shapes.length) ? _.sample(shapes) : '?';
  }

  return Chord.findByShape(chord);
}
