import {
  components as rawComponents,
  kebabcase
} from "https://designstem.github.io/fachwerk/fachwerk.js";

const components = Object.entries(rawComponents).map(([key, value]) => {
  return {
    pascalName: key,
    kebabName: kebabcase(key),
    about: value.description ? value.description.trim().split(/\n/)[0] : "",
    ...value
  };
});

const formatType = typename => {
  if (!Array.isArray(typename)) {
    typename = [typename];
  }
  return typename
    .map(t =>
      typeof t == "function" ? (t() instanceof Array ? "array" : typeof t()) : t
    )
    .map(t => `_${t}_`)
    .join(", ");
};

const formatProps = ({ props }) =>
  Object.entries(props)
    .map(
      ([key, value]) => `\`${key}="${value.default}"\` ${
        value.type ? formatType(value.type) : ""
      }\n
${value.description || ""}
  `
    )
    .join("\n---\n");

const formatDocs = component =>
  `[Documentation](https://designstem.github.io/fachwerk/docs/#${component.kebabName}) [Source](https://github.com/designstem/fachwerk/blob/master/src/components/2d/${component.pascalName}.js)`;

const tagSuggestions = range => {
  return components.map(c => {
    return {
      label: c.kebabName,
      kind: monaco.languages.CompletionItemKind.Function,
      documentation: c.about,
      insertText: `<${c.kebabName}>`,
      range
    };
  });
};

export const provideCompletionItems = (model, position) => {
  const word = model.getWordUntilPosition(position);
  if (word.word == "f-") {
    var range = {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: word.startColumn,
      endColumn: word.endColumn
    };
    return {
      suggestions: tagSuggestions(range)
    };
  }
  return [];
};

export const provideHover = (model, position) => {
  const word = model.getWordAtPosition(position);

  if (word) {
    var range = {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: word.startColumn,
      endColumn: word.endColumn
    };

    if (word.word.startsWith("f-")) {
      const component = components.filter(c => c.kebabName == word.word)[0];

      if (component) {
        return {
          range,
          contents: [
            {
              value: `\`<${component.kebabName}>\``
            },
            {
              value: `${component.about}`
            },
            {
              value: formatDocs(component)
            },
            {
              value: formatProps(component)
            }
          ]
        };
      }
    }
  }
  return {};
};
