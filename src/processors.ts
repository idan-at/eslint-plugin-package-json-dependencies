import { Linter } from "eslint";
import { jsonToJs, fixRange } from "./json-to-js";

const processors = {
  ".json": {
    preprocess: (source: string): string[] => [jsonToJs(source)],
    postprocess: (
      messagesLists: Linter.LintMessage[][]
    ): Linter.LintMessage[] =>
      messagesLists.flat().map((message) => {
        if (message.fix) {
          message.fix.range = fixRange(message.fix.range);
        }

        return message;
      }),
    supportsAutofix: true,
  },
};

export { processors };
