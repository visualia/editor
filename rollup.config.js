import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import css from "rollup-plugin-css-porter";

export default [
  {
    input: "./src/editor.js",
    output: {
      dir: "./deps",
      format: "es",
      chunkFileNames: "[name].js"
    },
    plugins: [
      css({ dest: "./deps/editor.css" }),
      resolve(),
      commonjs(),
      terser()
    ]
  },
  {
    input: "node_modules/monaco-editor/esm/vs/editor/editor.worker.js",
    output: {
      file: "./deps/editor.worker.js",
      format: "umd",
      name: "editor"
    },
    plugins: [resolve(), commonjs(), terser()]
  },
  {
    input: "node_modules/monaco-editor/esm/vs/language/html/html.worker.js",
    output: {
      file: "./deps/html.worker.js",
      format: "umd",
      name: "html"
    },
    plugins: [resolve(), commonjs(), terser()]
  }
];
