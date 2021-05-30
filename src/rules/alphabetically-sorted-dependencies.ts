import {
  isPackageJsonFile,
  isValidJsonAST,
  extractPropertyObjectExpression,
} from "../utils";
import { Rule } from "eslint";
import _ from "lodash";
import { Program, ExpressionStatement, ObjectExpression } from "estree";

const DEPENDENCIES_KEYS = [
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies",
];

const isSorted = (list: string[]): boolean =>
  list.slice(1).every((item, i) => list[i] <= item);

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
  },
  create: function (context: Rule.RuleContext): Rule.RuleListener {
    return {
      "Program:exit": (node: Rule.Node) => {
        const filePath = context.getFilename();

        if (!isPackageJsonFile(filePath)) {
          return;
        }

        if (!isValidJsonAST(node)) {
          context.report({
            node,
            messageId: "invalidJson",
          });

          return;
        }

        const packageJsonAST = (
          (node as Program).body[0] as ExpressionStatement
        ).expression as ObjectExpression;

        DEPENDENCIES_KEYS.forEach((key) => {
          const dependenciesList = extractPropertyObjectExpression(
            packageJsonAST,
            key
          );

          if (!isSorted(dependenciesList)) {
            context.report({
              node,
              messageId: "unsortedDependencies",
              data: {
                key,
              },
            });
          }
        });
      },
    };
  },
};

export { rule };
