import { isPackageJsonFile, isValidJson, getDependenciesSafe } from "../utils";
import { Rule } from "eslint";
import _ from "lodash";

const DEPENDENCIES_KEYS = [
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies",
];

const isSorted = (list: string[]): boolean =>
  list.slice(1).every((item, i) => list[i] <= item);

const sortObjectKeysAlphabetically = (
  obj: Record<string, string>
): Record<string, string> => _(obj).toPairs().sortBy(0).fromPairs().value();

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    messages: {
      invalidJson: "Package JSON is not a valid JSON file",
      unsortedDependencies:
        "Dependencies under {{ key }} are not alphabetically sorted",
    },
    docs: {
      description: "sort dependencies alphabetically",
      category: "Possible Errors",
      recommended: true,
      url: "https://github.com/idan-at/eslint-plugin-package-json-dependencies/blob/master/docs/rules/alphabetically-sorted-dependencies.md",
    },
    schema: [],
    fixable: "code",
  },
  create: function (context: Rule.RuleContext): Rule.RuleListener {
    return {
      "Program:exit": (node: Rule.Node) => {
        const filePath = context.getFilename();

        if (!isPackageJsonFile(filePath)) {
          return;
        }

        const processedSource = context.getSourceCode().text;
        const text = processedSource.substring(1, processedSource.length - 1);

        if (!isValidJson(text)) {
          context.report({
            node,
            messageId: "invalidJson",
          });

          return;
        }

        const packageJson = JSON.parse(text);

        DEPENDENCIES_KEYS.forEach((key) => {
          const dependenciesList = getDependenciesSafe(packageJson, key);

          if (!isSorted(dependenciesList)) {
            context.report({
              node,
              messageId: "unsortedDependencies",
              data: {
                key,
              },
              fix: (fixer: Rule.RuleFixer) => {
                const keyIndex = processedSource.indexOf(`"${key}":`);
                const rangeStart = processedSource.indexOf("{", keyIndex);
                const rangeEnd = processedSource.indexOf("}", keyIndex) + 1;

                const fixedSourceWithoutIndentation = JSON.stringify(
                  sortObjectKeysAlphabetically(packageJson[key]),
                  null,
                  2
                );
                const fixedSource = fixedSourceWithoutIndentation
                  .split("\n")
                  .map((line, idx) => (idx === 0 ? line : `  ${line}`))
                  .join("\n");

                return fixer.replaceTextRange(
                  [rangeStart, rangeEnd],
                  fixedSource
                );
              },
            });
          }
        });
      },
    };
  },
};

export { rule };
