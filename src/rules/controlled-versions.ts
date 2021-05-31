import { isPackageJsonFile } from "../utils";
import { Rule } from "eslint";
import { forEach } from "lodash";
import { parse as parseSemver } from "semver";
import { DEPENDENCIES_KEYS } from "./constants";

interface RuleOptions {
  granularity?: "fixed" | "patch" | "minor";
}

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    messages: {
      nonControlledDependency: "Non controlled version found for {{ package }}",
    },
    docs: {
      description: "detect uncontrolled dependencies versions",
      category: "Possible Errors",
      url: "https://github.com/idan-at/eslint-plugin-package-json-dependencies/blob/master/docs/rules/controlled-versions.md",
    },
    schema: [
      {
        type: "object",
        properties: {
          granularity: {
            type: "string",
            enum: ["fixed", "patch", "minor"]
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

        const { granularity = "fixed" } = (context.options[0] || {}) as RuleOptions;

        const packageJson = JSON.parse(text);

        DEPENDENCIES_KEYS.forEach((key) => {
          forEach(packageJson[key] || {}, (version, dependency) => {
            switch (granularity) {
              case "fixed":
                if (!parseSemver(version)) {
                  context.report({
                    node,
                    messageId: "nonControlledDependency",
                    data: {
                      package: dependency,
                    },
                  })
                }

                break;
              case "minor":
                if (!version.startsWith("^")) {
                  context.report({
                    node,
                    messageId: "nonControlledDependency",
                    data: {
                      package: dependency,
                    },
                  })
                }

                break;
              case "patch":
                if (!version.startsWith("~")) {
                  context.report({
                    node,
                    messageId: "nonControlledDependency",
                    data: {
                      package: dependency,
                    },
                  })
                }

                break;
              default:
              // unsupported granularity, ignoring.
            }
          })
        });
      },
    };
  },
};

export { rule };
