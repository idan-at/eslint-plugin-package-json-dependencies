import { isPackageJsonFile } from "./utils";

type PostProcessMessage = { ruleId: string };

const processors = {
  ".json": {
    preprocess: (source: string, filename: string): string[] =>
      isPackageJsonFile(filename) ? [`(${source})`] : [source],
    postprocess: (messages: PostProcessMessage[][]) =>
      messages[0].filter(
        (message) =>
          message.ruleId.startsWith("package-json-dependencies/")
      ),
  },
};

export { processors };
