import { isPackageJsonFile, getDependenciesSafe } from "../utils";
import { Rule } from "eslint";
import _ from "lodash";
import { DEPENDENCIES_KEYS } from "./constants";

interface RuleOptions {
  exclude: string[];
}

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    messages: {
      duplicateDependencyFound:
        "dependency '{{ package }}' declared multiple times ({{ origins }})",
    },
    docs: {
      description: "detect dependencies declared on multiple levels",
      category: "Possible Errors",
      url: "https://github.com/idan-at/eslint-plugin-package-json-dependencies/blob/master/docs/rules/duplicate-dependencies.md",
    },
    schema: [
      {
        type: "object",
        properties: {
          exclude: {
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

        const { text } = context.getSourceCode();

        const { exclude = [] } = (context.options[0] || {}) as RuleOptions;

        const packageJson = JSON.parse(text);
        const dependencies = {};

        DEPENDENCIES_KEYS.forEach((key) => {
          const dependenciesList = getDependenciesSafe(packageJson, key);
          dependenciesList.forEach((dependency) => {
            if (!(dependency in dependencies)) {
              dependencies[dependency] = [];
            }

            dependencies[dependency].push(key);
          });
        });

        Object.keys(dependencies)
          .filter((dependency) => !exclude.includes(dependency))
          .forEach((dependency) => {
            if (dependencies[dependency].length > 1) {
              context.report({
                node,
                messageId: "duplicateDependencyFound",
                data: {
                  package: dependency,
                  origins: `[${dependencies[dependency].join(",")}]`,
                },
              });
            }
          });
      },
    };
  },
};

export { rule };
