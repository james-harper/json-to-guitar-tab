/**
 * The main Vue instance
 */
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

/**
 * Configure JSON textarea to behave more like a text editor.
 * Eg tab indentation and shift+tab outdentation.
 */
var editor = new Behave({
  textarea: document.getElementById('jsonEditor'),
  tabSize: 2,
  overwrite: false
});
