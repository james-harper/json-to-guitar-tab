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