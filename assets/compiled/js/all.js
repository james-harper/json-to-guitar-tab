'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * Chord types that are currently supported
 */
var supportedChords = ['major', 'minor', 'dim', '5', '7', 'maj7', 'min7'];

/**
 * Guitar strings in standard tuning
 */
var strings = {
  e: 'e',
  B: 'B',
  G: 'G',
  D: 'D',
  A: 'A',
  E: 'E'
};

/**
 * Misc constants
 */
var constants = {
  BEATS_PER_BAR: 4
};
var Bar = {};

/**
 * Render a bar of tablature for a single string
 *
 * @param {string[]} chords The chords that should be drawn in this bar
 * @param {string} string The guitar string that is being drawn
 * @param {string} pattern The rhythm that should be drawn
 * @param {number} index Used to determine if this bar will be at the start of a line
 */
Bar.draw = function (chords, string, pattern, index) {
  pattern = Pattern.fitToBar(pattern);

  var note = '-';
  var output = '';

  if (index % constants.BEATS_PER_BAR === 0) {
    output += string + '|';
  }

  var multiplier = 1;
  var currentChord = 0;

  for (var i = 0; i < pattern.length; i++) {
    var cutoff = Math.ceil(pattern.length / chords.length);

    if (i >= cutoff * multiplier) {
      currentChord++;
      multiplier++;
    }

    var chord = chords[currentChord];

    switch (string) {
      case strings.e:
        note = chord[5];break;
      case strings.B:
        note = chord[4];break;
      case strings.G:
        note = chord[3];break;
      case strings.D:
        note = chord[2];break;
      case strings.A:
        note = chord[1];break;
      case strings.E:
        note = chord[0];break;
    }

    // Use hex to represent higher frets
    if (!['x', 'X', '-'].includes(note)) {
      note = parseInt('0x' + note, 16);
    }

    if (!Note.isValid(note)) {
      note = '-';
    }

    var dontOutput = note >= 10 && pattern[i - 1] !== '-' && pattern[i - 1] !== undefined;
    if (!dontOutput) {
      output += pattern[i] !== '-' ? note : '-';
    }
  }

  output += '|';

  return output;
};
var Chord = {};

/**
 * Find the name of a chord from its shape.
 *
 * @param {string} target The chord shape that is being matched against a name. Eg '-32010'
 * @returns {string} Either the name of the chord or '?' if no match was found.
 */
Chord.findByShape = function (target) {
  var result = '?';

  _(chordMap).each(function (chords, root) {
    _(chords).each(function (chord, tonality) {
      if (chord.length) {
        _(chord).each(function (shape) {
          if (shape === target) {
            return result = root + ' ' + tonality;
          }
        });
      }
    });
  });

  return result;
};

/**
 * Find chord shape from its name.
 *
 * @param {string} name The name of the chord. Eg D major
 * @returns {string[]} Any shapes that match the given name
 */
Chord.findByName = function (name) {
  var splitBy = '_';
  var root = void 0;
  var tonality = void 0;

  name = name.replace(/\s/g, splitBy).toLowerCase();

  _(supportedChords).each(function (ext) {
    if (name.includes(ext)) {
      name = name.replace(splitBy, '');
      root = name.split(ext)[0];
      tonality = ext;
    }
  });

  if (!root && !tonality) {
    var _name$split = name.split(splitBy);

    var _name$split2 = _slicedToArray(_name$split, 2);

    root = _name$split2[0];
    tonality = _name$split2[1];
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
Chord.isNamed = function (chord) {
  var match = false;

  supportedChords.forEach(function (ext) {
    if (ext.length === 1) {
      ext = ' ' + ext;
    }

    if (chord.includes(ext)) {
      match = true;
    }
  });

  return match;
};

/**
 * @param {string} chord Accepts either a name or a shape
 * @returns {string}
 */
Chord.find = function (chord) {
  if (Chord.isNamed(chord)) {
    var shapes = Chord.findByName(chord);
    return shapes.length ? _.sample(shapes) : '?';
  }

  return Chord.findByShape(chord);
};
var Note = {};

/**
 * Normalise notes to simplify lookups. Sharps will be converted to flats.
 *
 * @param {string} note
 * @returns {string} The converted note
 */
Note.convertAccidental = function (note) {
  if (note.length === 1) {
    return _.toUpper(note);
  }

  var converted = _.toUpper(note.charAt(0));
  if (note.charAt(1) === '#') {
    converted = String.fromCharCode(converted.charCodeAt() + 1);
    note = converted < 'H' ? converted : 'A';

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
Note.isValid = function (note) {
  if (note === 'x' || note === 'X') return true;
  if (note === '-') return true;
  if (isNaN(note)) return false;
  if (_.isNumber(note)) return true;
  if (['a', 'b', 'c', 'd', 'e', 'f'].includes(note.toLowerCase())) return true;

  return false;
};
var Pattern = {};

Pattern.desiredLength = constants.BEATS_PER_BAR * 4;

/**
 * Either truncate or pad the pattern so it reaches the appropriate length.
 *
 * @param {string} rhythm A rhythmic pattern
 * @returns {string}
 */
Pattern.fitToBar = function (rhythm) {
  if (rhythm.length < 1) {
    rhythm = '-';
  }

  rhythm = _.repeat(rhythm, Pattern.desiredLength / rhythm.length);

  if (rhythm.length < Pattern.desiredLength) {
    var padLength = Pattern.desiredLength - rhythm.length;
    rhythm += rhythm.substring(0, padLength);
  } else {
    rhythm = rhythm.substring(0, Pattern.desiredLength);
  }

  return rhythm;
};

/**
 * Randomly generate a rhythmic pattern
 *
 * @returns {string} A random pattern
 */
Pattern.random = function () {
  var rhythm = 'x';

  for (var i = 0; i < Pattern.desiredLength - 1; i++) {
    rhythm += _.random(1) > 0 ? 'x' : '-';
  }

  return rhythm;
};
/**
 * Map of currently supported chord shapes
 *
 * Hexadecimal numbers are used to represent frets
 *
 * @todo Add more chords
 */
var chordMap = {
  "A": {
    major: ["-02220", "577655"],
    minor: ["-02210", "577555", "-0a9a0"],
    5: ["577---", "-022--"],
    7: ["-02020", "-02023", "575655"],
    maj7: ["-02120", "5x665x"],
    min7: ["-02013", "575555", "-02010"],
    dim: []
  },
  "Bb": {
    major: ["-13331", "688766"],
    minor: ["-13321", "688666"],
    5: ["688---", "-133--"],
    7: ["-13131", "686766"],
    maj7: ["-13231", "6x776x"],
    min7: ["-13121", "686666"],
    dim: []
  },
  "B": {
    major: ["-24442", "799877"],
    minor: ["799777", "-24432"],
    5: ["799---", "-244--"],
    7: ["-21202", "-24242", "797877"],
    maj7: ["-24342", "7x887x"],
    min7: ["-24232", "797777"],
    dim: []
  },
  "C": {
    major: ["-32010", "-32013", "-35553", "8aa988"],
    minor: ["-35543", "8aa888"],
    5: ["8aa---", "-355--"],
    7: ["-35353", "8a8988"],
    maj7: ["-35453", "8x998x"],
    min7: ["-35343"],
    dim: []
  },
  "Db": {
    major: ["-46664", "9bba99"],
    minor: ["-46654", "9bb999"],
    5: ["-466--"],
    7: ["-46464", "9b9a99"],
    maj7: ["-46564"],
    min7: ["-46454"],
    dim: []
  },
  "D": {
    major: ["--0232", "-57775"],
    minor: ["--0231", "-57765", "accaaa"],
    5: ["-577--", "--023-"],
    7: ["--0212", "-57575"],
    maj7: ["--0222", "-57675"],
    min7: ["--0211", "-57565"],
    dim: []
  },
  "Eb": {
    major: ["-68886"],
    minor: ["-68876"],
    5: ["-688--"],
    7: ["-68686"],
    maj7: ["-68786"],
    min7: ["-68676"],
    dim: []
  },
  "E": {
    major: ["022100", "-79997", "076---"],
    minor: ["022000", "-79987", "022003"],
    5: ["022---", "-799--", "079---"],
    7: ["020130", "-79797"],
    maj7: ["-79897"],
    min7: ["022030", "-79787"],
    dim: []
  },
  "F": {
    major: ["133211", "-8aaa8"],
    minor: ["133111", "-8aa98"],
    5: ["133---"],
    7: ["131211", "-8a8a8"],
    maj7: ["-8a9a8"],
    min7: ["-8a898"],
    dim: []
  },
  "Gb": {
    major: ["244322", "-9bbb9"],
    minor: ["244222", "-9bba9"],
    5: ["244---"],
    7: ["242322", "-9b9b9"],
    maj7: ["-9bab9"],
    min7: ["-9b9a9"],
    dim: []
  },
  "G": {
    major: ["355433", "320033", "320003"],
    minor: ["355333"],
    5: ["355---"],
    7: ["320001", "353433"],
    maj7: ["3x443x"],
    min7: ["353333"],
    dim: []
  },
  "Ab": {
    major: ["466544"],
    minor: ["466444"],
    5: ["466---"],
    7: ["464544"],
    maj7: ["4x554x"],
    min7: ["464444"],
    dim: []
  }
};

/**
 * Example chord progressions.
 * One of these will be loaded at random on page load.
 */
var examples = [];

/**
 * Pachelbel's Canon in D
 */
examples.push([{
  chords: ['D major'],
  pattern: 'x-------'
}, {
  chords: ['577655'],
  pattern: 'x---'
}, {
  chords: ['B minor'],
  pattern: 'x---'
}, {
  chords: ['F# minor'],
  pattern: 'x---'
}, {
  chords: ['G major'],
  pattern: 'x---xxxx----x-x-'
}, {
  chords: ['D major'],
  pattern: 'x---'
}, {
  chords: ['G major'],
  pattern: 'x---'
}, {
  chords: ['A major'],
  pattern: 'x-x-'
}]);

/**
 * vi–IV–I–V
 */
examples.push([{
  chords: ["A minor"],
  pattern: 'x---'
}, {
  chords: ['F major'],
  pattern: 'x---'
}, {
  chords: ['C major'],
  pattern: 'x---'
}, {
  chords: ['G major', "E minor"],
  pattern: 'x---'
}]);

/**
 * I-V-vi-IV
 * @see https://www.youtube.com/watch?v=5pidokakU4I
 */
examples.push([{
  chords: ['-57775'],
  pattern: 'x---'
}, {
  chords: ['577655'],
  pattern: 'x-x-'
}, {
  chords: ['799777'],
  pattern: 'x-x-'
}, {
  chords: ['355433'],
  pattern: 'x-x-'
}]);

/**
 * Generic Pop Punky thing
 */
examples.push([{
  chords: ['C 5'],
  pattern: 'x-x-'
}, {
  chords: ['G 5'],
  pattern: 'x-x-'
}, {
  chords: ['F 5'],
  pattern: 'x-x-'
}, {
  chords: ['F 5'],
  pattern: 'x-x-'
}]);

Vue.component('tab-bar', {
  template: '\n  <span>\n    <span v-if="showChordNames" v-for="(chord, index) in bar.chords" style="font-size:11px">\n      {{ index > 0 ? \' | \' : \'\'}}\n      {{!Chord.isNamed(chord) ? Chord.findByShape(chord) : chord}}\n    </span>\n    <span class="tab-line">{{draw(strings.e)}}</span>\n    <span class="tab-line">{{draw(strings.B)}}</span>\n    <span class="tab-line">{{draw(strings.G)}}</span>\n    <span class="tab-line">{{draw(strings.D)}}</span>\n    <span class="tab-line">{{draw(strings.A)}}</span>\n    <span class="tab-line">{{draw(strings.E)}}</span>\n  </span>\n  ',
  props: ['bar', 'index', 'showChordNames'],
  methods: {
    /**
     * Render one bar of tablature for a single string
     *
     * @param {string} string
     * @returns {string}
     */
    draw: function draw(string) {
      this.convertNamedtoShapes();

      if (this.bar.pattern.toLowerCase() === 'random') {
        this.bar.pattern = Pattern.random();
      }

      return Bar.draw(this.bar.chords, string, this.bar.pattern, this.index);
    },

    /**
     * Convert any chords passed in by name into the approriate shape
     * @returns {string}
     */
    convertNamedtoShapes: function convertNamedtoShapes() {
      this.bar.chords = this.bar.chords.map(function (chord) {
        var shapes = [];
        var extensions = _(supportedChords).sortBy(function (ext) {
          return ext.length;
        }).reverse().value();

        _(extensions).each(function (ext) {
          // Prepend single character extensions with a space
          // to protect against unwanted matches.
          // eg 7 without the space would match against "x79997"
          if (ext.length === 1) {
            ext = ' ' + ext;
          }

          if (chord.toLowerCase().includes(ext)) {
            shapes = Chord.findByName(chord);
          };
        });

        if (shapes.length) {
          var index = _.random(0, shapes.length - 1);
          chord = shapes[index];
        }

        return chord;
      });
    }
  },
  created: function created() {
    this.convertNamedtoShapes();
  }
});
Vue.component('tab', {
  template: '\n  <div class="tab-section">\n    <span v-for="(chunk, index) in chunked" class="row tab-row">\n      <span v-for="(bar, index) in chunk" class="bar">\n        <tab-bar :index="index" :bar="bar" :showChordNames="showChordNames"></tab-bar>\n      </span>\n    </span>\n  </div>\n  ',
  props: ['progression', 'showChordNames'],
  computed: {
    chunked: function chunked() {
      return _.chunk(this.progression, constants.BEATS_PER_BAR);
    }
  }
});
/**
 * The main Vue instance
 */
new Vue({
  el: "#app",
  data: {
    json: JSON.stringify(_.sample(examples))
  },
  computed: {
    progression: function progression() {
      return JSON.parse(this.json);
    }
  },
  created: function created() {
    this.json = JSON.stringify(JSON.parse(this.json), null, 2);
  }
});

/**
 * Configure JSON textarea to behave more like a text editor.
 * Eg tab indentation and shift+tab outdentation.
 */
var editor = new Behave({
  textarea: document.getElementById('jsonEditor'),
  tabSize: 2,
  overwrite: false
});