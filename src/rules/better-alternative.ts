import { isPackageJsonFile, getDependenciesSafe } from "../utils";
import { Rule } from "eslint";
import _ from "lodash";
import { DEPENDENCIES_KEYS } from "./constants";

interface RuleOptions {
  alternatives: Record<string, string>;
}

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    messages: {
      betterAlternativeExists:
        "Replace '{{ package }}' with '{{ alternative }}'",
    },
    docs: {
      description: "prefer certain packages over others",
      category: "Possible Errors",
      url: "https://github.com/idan-at/eslint-plugin-package-json-dependencies/blob/master/docs/rules/better-alternative.md",
    },
    schema: [
      {
        type: "object",
        properties: {
          alternatives: {
            type: "object",
            patternProperties: {
              "^.+$": { type: "string" },
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

        const packageJson = JSON.parse(text);

        const { alternatives = {} } = (context.options[0] || {}) as RuleOptions;
        const packagesToReplace = Object.keys(alternatives);

        DEPENDENCIES_KEYS.forEach((key) => {
          const dependenciesList = getDependenciesSafe(packageJson, key);

          dependenciesList.forEach((dependency) => {
            if (packagesToReplace.includes(dependency)) {
              context.report({
                node,
                messageId: "betterAlternativeExists",
                data: {
                  package: dependency,
                  alternative: alternatives[dependency],
                },
              });
            }
          });
        });
      },
    };
  },
};

export { rule };
