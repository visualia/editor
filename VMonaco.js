import {
  watch,
  ref,
  onMounted
} from " https://visualia.github.io/visualia/src/deps/vue.js";
import * as monaco from "./dist/editor.js";
import { provideCompletionItems, provideHover } from "./providers.js";

self.MonacoEnvironment = {
  getWorkerUrl: function(moduleId, label) {
    if (label === "html") {
      return "./dist/html.worker.js";
    }
    return "./dist/editor.worker.js";
  }
};

export const VMonaco = {
  props: { value: { default: "" } },
  setup(props, { emit }) {
    const editorNode = ref(null);

    onMounted(() => {
      // Setting up autcomplete and hover providers

      monaco.languages.registerCompletionItemProvider("html", {
        provideCompletionItems
      });
      monaco.languages.registerHoverProvider("html", { provideHover });

      // Setting up editor

      const editor = monaco.editor.create(editorNode.value, {
        language: "html",
        theme: "vs-dark",
        fontSize: "15px",
        wordWrap: "wordWrapColumn",
        wordWrapColumn: 75,
        lineNumbers: "off",
        minimap: {
          enabled: false
        }
      });
      const model = editor.getModel();
      model.updateOptions({ tabSize: 2 });

      // When editor content changes
      // we emit input event so the component
      // works with v-model

      editor.onDidChangeModelContent(e => {
        emit("input:content", editor.getValue());
      });

      // We only change editor content
      // when value prop is really different
      // from what we emitted for v-model
      // otherwise we get the recursive loop

      watch(
        () => props.content,
        content => {
          if (content !== editor.getValue()) {
            model.pushEditOperations(
              [],
              [
                {
                  range: model.getFullModelRange(),
                  text: content
                }
              ]
            );
          }
        }
      );
    });

    return { editorNode };
  },
  template: `
    <div ref="editorNode" style="height: 100vh" />
  `
};
