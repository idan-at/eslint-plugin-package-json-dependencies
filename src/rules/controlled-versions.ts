import { isPackageJsonFile } from "../utils";
import { Rule } from "eslint";
import _ from "lodash";
import { parse as parseSemver } from "semver";
import { DEPENDENCIES_KEYS } from "./constants";
import { Dependencies } from "../types";
import micromatch from "micromatch";

const isFixedVersion = (version: string): boolean =>
  parseSemver(version) !== null;
const isPatchOrLess = (version: string): boolean =>
  isFixedVersion(version) || version.startsWith("~");
const isMinorOrLess = (version: string): boolean =>
  isPatchOrLess(version) || version.startsWith("^");

interface RuleOptions {
  granularity?: "fixed" | "patch" | "minor";
  excludePatterns: string[];
}

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    messages: {
      nonControlledDependency:
        "Non controlled version found for dependency '{{ package }}'",
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
            enum: ["fixed", "patch", "minor"],
          },
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

        const { text } = context.getSourceCode();

        const { granularity = "fixed", excludePatterns = [] } = (context
          .options[0] || {}) as RuleOptions;

        const packageJson = JSON.parse(text);

        DEPENDENCIES_KEYS.forEach((key) => {
          const dependencies: Dependencies = packageJson[key] || {};

          _(dependencies)
            .pickBy(
              (_, dependency) =>
                micromatch([dependency], excludePatterns).length === 0
            )
            .forEach((version, dependency) => {
              if (!version) {
                return;
              }

              switch (granularity) {
                case "fixed":
                  if (!isFixedVersion(version)) {
                    context.report({
                      node,
                      messageId: "nonControlledDependency",
                      data: {
                        package: dependency,
                      },
                    });
                  }

                  break;
                case "patch":
                  if (!isPatchOrLess(version)) {
                    context.report({
                      node,
                      messageId: "nonControlledDependency",
                      data: {
                        package: dependency,
                      },
                    });
                  }

                  break;
                case "minor":
                  if (!isMinorOrLess(version)) {
                    context.report({
                      node,
                      messageId: "nonControlledDependency",
                      data: {
                        package: dependency,
                      },
                    });
                  }

                  break;
                default:
                // unsupported granularity, ignoring.
              }
            });
        });
      },
    };
  },
};

export { rule };
