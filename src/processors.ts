import { isPackageJsonFile } from "./utils";
import { Linter } from "eslint";

const processors = {
  ".json": {
    preprocess: (source: string, filename: string): string[] =>
      isPackageJsonFile(filename) ? [`(${source})`] : [source],
    postprocess: (
      messagesLists: Linter.LintMessage[][]
    ): Linter.LintMessage[] => messagesLists.flat(),
    supportsAutofix: true,
  },
};

export { processors };
