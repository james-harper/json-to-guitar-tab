/**
 * Find the name of a chord from its shape. Eg '-32010'
 */
function findByShape(target) {
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
 * Find chord shape from its name. Eg 'D major'
 */
function findByName(name) {
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

  root = convertAccidental(root);
  return chordMap[root][tonality];
};

/**
 * Determine whether a chord has been passed by name
 * (As opposed to shape)
 */
function isNamed(chord) {
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
