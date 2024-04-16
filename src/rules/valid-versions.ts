import {
  isPackageJsonFile,
  isFileDependency,
  isGitDependency,
  isWorkspaceDependency,
  isDistTagDependency,
  resolveDistTag,
} from "../utils";
import { Rule } from "eslint";
import _ from "lodash";
import { valid as validSemver, validRange as validSemverRange } from "semver";
import { DEPENDENCIES_KEYS } from "./constants";
import { Dependencies } from "../types";

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    messages: {
      invalidVersionDetected:
        "Invalid version found for dependency '{{ package }}' ({{ reason }})",
    },
    docs: {
      description: "detect invalid dependencies versions",
      category: "Possible Errors",
      url: "https://github.com/idan-at/eslint-plugin-package-json-dependencies/blob/master/docs/rules/valid-versions.md",
    },
    schema: [
      {
        type: "object",
        properties: {},
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

        const reportUnlessValidVersion = (
          dependency: string,
          version: string,
        ) => {
          if (isDistTagDependency(version)) {
            try {
              resolveDistTag(dependency, version);
            } catch {
              context.report({
                node,
                messageId: "invalidVersionDetected",
                data: {
                  package: dependency,
                  reason: "dist tag does not exist",
                },
              });
            }
          } else if (!validSemver(version) && !validSemverRange(version)) {
            context.report({
              node,
              messageId: "invalidVersionDetected",
              data: {
                package: dependency,
                reason: "invalid version format",
              },
            });
          }
        };

        DEPENDENCIES_KEYS.forEach((key) => {
          const dependencies: Dependencies = packageJson[key] || {};

          _(dependencies)
            .omitBy(
              (version) =>
                isGitDependency(version!) || isFileDependency(version!),
            )
            .forEach((version, dependency) => {
              if (!version) {
                return;
              }

              if (isWorkspaceDependency(version)) {
                const extractedVersion = version.replace("workspace:", "");
                if (extractedVersion.startsWith(" ")) {
                  context.report({
                    node,
                    messageId: "invalidVersionDetected",
                    data: {
                      package: dependency,
                      reason: "space detected after worksapce protocol",
                    },
                  });
                } else {
                  reportUnlessValidVersion(dependency, extractedVersion);
                }
              } else {
                reportUnlessValidVersion(dependency, version);
              }
            });
        });
      },
    };
  },
};

export { rule };
