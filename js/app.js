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
 * Find the name of a chord from its shape. Eg '-32010'
 */
const findByShape = function(target) {
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
const findByName = function(name) {
  let splitBy = '_';
  let root;
  let tonality;
  let extensions = [
    7, 'dim', 'maj7', 'min7',
  ];

  name = name.replace(/\s/g, splitBy);

  _(extensions).each(ext => {
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

const strings = {
  e: 'e',
  B: 'B',
  G: 'G',
  D: 'D',
  A: 'A',
  E: 'E'
};

const constants = {
  BEATS_PER_BAR: 4
};

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

function drawBar(chords, string, pattern, index) {
  pattern = makePatternFitBar(pattern);

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
    if (note !== '-' && note !== 'x') {
      note = parseInt('0x'+note, 16);
    }

    let dontOutput = (note >= 10 && pattern[i-1] !== '-' && pattern[i-1] !== undefined);
    if (!dontOutput) {
      output += (pattern[i] !== '-') ? note : '-';
    }
  }

  output += '|';

  return output;
}

Vue.component('tab-bar', {
  template:`
  <span>
    <span v-for="(chord, index) in bar.chords" style="font-size:11px">
      {{ index > 0 ? ' | ' : ''}} {{chord.length === 6 ? findByShape(chord) : chord}}
    </span>
    <span class="tab-line">{{draw(strings.e)}}</span>
    <span class="tab-line">{{draw(strings.B)}}</span>
    <span class="tab-line">{{draw(strings.G)}}</span>
    <span class="tab-line">{{draw(strings.D)}}</span>
    <span class="tab-line">{{draw(strings.A)}}</span>
    <span class="tab-line">{{draw(strings.E)}}</span>
  </span>
  `,
  props: ['bar', 'index'],
  methods: {
    draw(string) {
      this.convertNamedtoShapes();

      if (this.bar.pattern.toLowerCase() === 'random') {
        this.bar.pattern = makeRandomPattern();
      }

      return drawBar(this.bar.chords, string, this.bar.pattern, this.index);
    },
    convertNamedtoShapes() {
       // Convert any chords passed in by name into the approriate shape
      this.bar.chords = this.bar.chords.map(chord => {
        let shapes = [];

        if (chord.includes('major')) shapes = findByName(chord);
        if (chord.includes('minor')) shapes = findByName(chord);
        if (chord.includes('maj7')) shapes = findByName(chord);
        if (chord.includes('min7')) shapes = findByName(chord);
        if (chord.includes(' 7')) shapes = findByName(chord);
        if (chord.includes('dim')) shapes = findByName(chord);

        if (shapes.length) {
          let index = _.random(0, shapes.length - 1);
          chord = shapes[index];
        }

        return chord;
      });
    }
  },
  created() {
    this.convertNamedtoShapes();
  }
});

Vue.component('tab',{
  template: `
  <div class="tab-section">
    <span v-for="(chunk, index) in chunked" class="row">
      <span v-for="(bar, index) in chunk" class="bar">
        <tab-bar :index="index" :bar="bar"></tab-bar>
      </span>
    </span>
  </div>
  `,
  props: ['progression'],
  computed: {
    chunked() {
      return _.chunk(this.progression,constants.BEATS_PER_BAR);
    }
  }
});

const examples = [
  progression,
  progression_1,
  progression_2,
];

new Vue({
  el: "#app",
  data: {
    json: JSON.stringify(_.sample(examples))
  },
  computed: {
    progression() {
      return JSON.parse(this.json);
    }
  },
  created() {
    this.json = JSON.stringify(JSON.parse(this.json), null, 2);
  }
});

// Handle tabs in textarea
(function(){
var textareas = document.getElementsByTagName('textarea');
var count = textareas.length;
for(var i=0;i<count;i++){
  textareas[i].onkeydown = function(e){
    if(e.keyCode==9 || e.which==9){
      e.preventDefault();
      var s = this.selectionStart;
      this.value = this.value.substring(0,this.selectionStart) + "\t" + this.value.substring(this.selectionEnd);
      this.selectionEnd = s+1;
    }
  }
}
})()