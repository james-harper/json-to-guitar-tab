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
    if (!['x', 'X', '-'].includes(note)) {
      note = parseInt('0x'+note, 16);
    }

    if (!isValid(note)) {
      note = '-'
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
    <span v-if="showChordNames" v-for="(chord, index) in bar.chords" style="font-size:11px">
      {{ index > 0 ? ' | ' : ''}} {{findByShape(chord)}}
    </span>
    <span class="tab-line">{{draw(strings.e)}}</span>
    <span class="tab-line">{{draw(strings.B)}}</span>
    <span class="tab-line">{{draw(strings.G)}}</span>
    <span class="tab-line">{{draw(strings.D)}}</span>
    <span class="tab-line">{{draw(strings.A)}}</span>
    <span class="tab-line">{{draw(strings.E)}}</span>
  </span>
  `,
  props: ['bar', 'index', 'showChordNames'],
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
        let extensions = _(supportedChords)
        .sortBy(ext => ext.length)
        .reverse()
        .value();

        _(extensions).each(ext => {
          // Prepend single character extensions with a space
          // to protect against unwanted matches.
          // eg 7 without the space would match against "x79997"
          if (ext.length === 1) {
            ext = ' ' + ext;
          }

          if (chord.includes(ext)) {
            shapes = findByName(chord)
          };
        });

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