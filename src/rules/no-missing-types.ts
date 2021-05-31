import { isPackageJsonFile, getDependenciesSafe } from "../utils";
import { hasTypes } from "../has-types";
import { Rule } from "eslint";
import { groupBy } from "lodash";
import micromatch from "micromatch";

interface RuleOptions {
  excludePatterns: string[];
}

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    messages: {
      missingTypes: "Missing types for {{ package }}",
    },
    docs: {
      description: "detect missing @types dependencies",
      category: "Possible Errors",
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

        if (!isPackageJsonFile(filePath)) {
          return;
        }

        const cwd = context.getCwd();
        const { text } = context.getSourceCode();

        const { excludePatterns = [] } = (context.options[0] ||
          {}) as RuleOptions;

        const packageJson = JSON.parse(text);

        const dependencies = [
          ...getDependenciesSafe(packageJson, "devDependencies"),
          ...getDependenciesSafe(packageJson, "dependencies"),
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
