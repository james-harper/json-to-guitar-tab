Vue.component('tab',{
  template: `
  <div class="tab-section courier-new flex-center">
    <span v-for="(chunk, index) in chunked" class="row tab-row">
      <span v-for="(bar, index) in chunk" class="bar">
        <tab-bar :index="index" :bar="bar" :showChordNames="showChordNames" />
      </span>
    </span>
  </div>
  `,
  props: ['progression', 'showChordNames'],
  computed: {
    chunked() {
      return _.chunk(this.progression,constants.BEATS_PER_BAR);
    }
  }
});