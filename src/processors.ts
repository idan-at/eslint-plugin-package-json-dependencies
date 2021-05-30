import { Linter } from "eslint";

const processors = {
  ".json": {
    preprocess: (source: string): string[] => [`(${source})`],
    postprocess: (
      messagesLists: Linter.LintMessage[][]
    ): Linter.LintMessage[] =>
      messagesLists.flat().map((message) => {
        if (message.fix) {
          message.fix.range = [
            message.fix.range[0] - 1,
            message.fix.range[1] - 1,
          ];
        }

        return message;
      }),
    supportsAutofix: true,
  },
};

export { processors };
