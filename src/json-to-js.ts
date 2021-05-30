const JSON_FILE_TO_JS_PREFIX = `module.exports = `;
const JSON_FILE_TO_JS_PREFIX_LENGTH = JSON_FILE_TO_JS_PREFIX.length;

const jsonToJs = (text: string) => `${JSON_FILE_TO_JS_PREFIX}${text}`;

const jsToJson = (text: string) => text.substr(JSON_FILE_TO_JS_PREFIX_LENGTH);

const fixRange = (range: [number, number]): [number, number] => [
  range[0] - JSON_FILE_TO_JS_PREFIX_LENGTH,
  range[1] - JSON_FILE_TO_JS_PREFIX_LENGTH,
];

export { jsToJson, jsonToJs, fixRange };
