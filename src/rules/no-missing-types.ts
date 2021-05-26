import {
  isPackageJsonFile,
  isValidJsonAST,
  extractPropertyObjectExpression,
} from "../utils";
import { hasTypes } from "../has-types";
import { Rule } from "eslint";
import { groupBy } from "lodash";
import { Program, ExpressionStatement, ObjectExpression } from "estree";
import micromatch from "micromatch";

interface RuleOptions {
  excludePatterns: string[];
}

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    messages: {
      invalidJson: "Package JSON is not a valid JSON file",
      missingTypes: "Missing types for {{ package }}",
    },
    docs: {
      description: "detect missing @types dependencies",
      category: "Possible Errors",
      recommended: true,
      url: "https://github.com/idan-at/eslint-plugin-package-json-dependencies/blob/master/docs/rules/no-missing-types.md",
    },
    schema: [
      {
        type: "object",
        properties: {
          excludePatterns: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create: function (context: Rule.RuleContext): Rule.RuleListener {
    return {
      "Program:exit": (node: Rule.Node) => {
        const filePath = context.getFilename();

        // TODO: Remove ts-ignore after updating eslint types (https://github.com/DefinitelyTyped/DefinitelyTyped/pull/53408)
        // @ts-ignore
        const cwd = context.getCwd();

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

        const { excludePatterns = [] } = (context.options[0] ||
          {}) as RuleOptions;

        const packageJsonAST = (
          (node as Program).body[0] as ExpressionStatement
        ).expression as ObjectExpression;

        const dependencies = [
          ...extractPropertyObjectExpression(packageJsonAST, "devDependencies"),
          ...extractPropertyObjectExpression(packageJsonAST, "dependencies"),
        ];

        const {
          true: typesDependencies = [],
          false: allCodeDependencies = [],
        } = groupBy(dependencies, (dependency) =>
          dependency.startsWith("@types/")
        );

        const codeDependencies = allCodeDependencies.filter(
          (dependency) => micromatch([dependency], excludePatterns).length === 0
        );

        for (const dependency of codeDependencies) {
          if (!hasTypes(cwd, dependency, typesDependencies)) {
            context.report({
              node,
              messageId: "missingTypes",
              data: {
                package: dependency,
              },
            });
          }
        }
      },
    };
  },
};

export { rule };
