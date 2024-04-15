import path from "path";
import { Dependencies } from "./types";
import { execSync } from "child_process";

const DIST_TAGS_REGEX = new RegExp("^[a-zA-Z0-9-_]+$");

const isPackageJsonFile = (filePath: string): boolean =>
  path.basename(filePath) === "package.json";

const getDependenciesSafe = (
  object: Record<string, Dependencies>,
  key: string,
): string[] => Object.keys(object[key] || {}) || [];

const isGitDependency = (version: string): boolean => version.startsWith("git");
const isDistTagDependency = (version: string): boolean =>
  DIST_TAGS_REGEX.test(version);
const isFileDependency = (version: string): boolean =>
  version.startsWith("file");
const isWorkspaceDependency = (version: string): boolean =>
  version.startsWith("workspace");

function resolveDistTag(
  packageName: string,
  distTag: string,
): string | undefined {
  try {
    const stdout = execSync(
      `npm view ${packageName} dist-tags --json`,
    ).toString();

    return JSON.parse(stdout.trim())[distTag];
  } catch (e) {
    throw new Error(`package '${packageName}' does not exist`);
  }
}

export {
  isPackageJsonFile,
  getDependenciesSafe,
  isGitDependency,
  isDistTagDependency,
  isFileDependency,
  isWorkspaceDependency,
  resolveDistTag,
};
