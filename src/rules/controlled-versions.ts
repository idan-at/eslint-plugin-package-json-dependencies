import { isPackageJsonFile } from "../utils";
import { Rule } from "eslint";
import _ from "lodash";
import { parse as parseSemver, clean as cleanSemver, coerce, valid as validSemver } from "semver";
import { DEPENDENCIES_KEYS } from "./constants";
import { Dependencies, DependencyGranularity } from "../types";
import micromatch from "micromatch";
import { toControlledSemver } from "../to-controlled-semver";

const isGitDependency = (version: string): boolean => version.startsWith("git");
const isFileDependency = (version: string): boolean => version.startsWith("file");

const isFixedVersion = (version: string): boolean => {
  const cleanedSemver = cleanSemver(version);

  if (cleanedSemver === null) {
    return version.match(/^\d+$/) !== null;
  }

  return parseSemver(cleanedSemver) !== null;
};

const isPatchOrLess = (version: string): boolean =>
  isFixedVersion(version) || version.startsWith("~");
const isMinorOrLess = (version: string): boolean =>
  isPatchOrLess(version) || version.startsWith("^");

const fix = (
  text: string,
  key: string,
  dependency: string,
  versions: string[],
  isValid: (version: string) => boolean,
  granularity: DependencyGranularity,
  fixer: Rule.RuleFixer
): Rule.Fix => {
  const keyIndex = text.indexOf(`"${key}":`);
  const packageIndex = text.indexOf(`"${dependency}":`, keyIndex);
  const rangeStart = text.indexOf(`"${versions[0]}`, packageIndex) + 1;
  const lastVersionStart = text.indexOf(`${versions[versions.length - 1]}`, packageIndex) + 1;
  const rangeEnd = text.indexOf('"', lastVersionStart);

  let versionsString = text.substring(rangeStart, rangeEnd)
  versions.forEach(version => {
    if (!isValid(version)) {
      const fixedVersion =  toControlledSemver(dependency, version, granularity)
      versionsString = versionsString.replace(version, fixedVersion)
    }
  });

  return fixer.replaceTextRange([rangeStart, rangeEnd], versionsString);
};

interface RuleOptions {
  granularity?: DependencyGranularity;
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
    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          granularity: {
            type: "string",
            // All options of DependencyGranularity
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
            .omitBy((version) => isGitDependency(version!) || isFileDependency(version!))
            .forEach((version, dependency) => {
              if (!version) {
                return;
              }

              const versions = version.split(/\|\|| - /).map(s => s.trim());
              
              switch (granularity) {
                case "fixed":
                  if (versions.some(v => !isFixedVersion(v))) {
                    context.report({
                      node,
                      messageId: "nonControlledDependency",
                      data: {
                        package: dependency,
                      },
                      fix: (fixer: Rule.RuleFixer) =>
                        fix(text, key, dependency, versions, isFixedVersion, granularity, fixer),
                    });
                  }

                  break;
                case "patch":
                  if (versions.some(v => !isPatchOrLess(v))) {
                    context.report({
                      node,
                      messageId: "nonControlledDependency",
                      data: {
                        package: dependency,
                      },
                      fix: (fixer: Rule.RuleFixer) =>
                        fix(text, key, dependency, versions, isPatchOrLess, granularity, fixer),
                    });
                  }

                  break;
                case "minor":
                  if (versions.some(v => !isMinorOrLess(v))) {
                    context.report({
                      node,
                      messageId: "nonControlledDependency",
                      data: {
                        package: dependency,
                      },
                      fix: (fixer: Rule.RuleFixer) =>
                        fix(text, key, dependency, versions, isMinorOrLess, granularity, fixer),
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
