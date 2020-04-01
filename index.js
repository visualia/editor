import { visualia } from " https://visualia.github.io/visualia/dist/visualia.js";
import { VEditor } from "./src/VEditor.js";
import { VSlider2 } from "./VSlider2.js";

visualia({
  components: { VEditor, VSlider2 },
  template: `<v-editor content="<v-slider2 />" />`
});
