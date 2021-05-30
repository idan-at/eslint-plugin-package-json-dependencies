import { Linter } from "eslint";

const processors = {
  ".json": {
    preprocess: (source: string): string[] => [`(${source})`],
    postprocess: (
      messagesLists: Linter.LintMessage[][]
    ): Linter.LintMessage[] => messagesLists.flat(),
    supportsAutofix: true,
  },
};

export { processors };
