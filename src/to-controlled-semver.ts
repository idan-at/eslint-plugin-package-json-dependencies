import { DependencyGranularity } from "./types";
import { execSync } from "child_process";
import { resolveDistTag } from "./utils";

function getLatestVersion(packageName: string): string {
  try {
    const stdout = execSync(
      `npm view ${packageName} version --json`,
    ).toString();

    return JSON.parse(stdout.trim());
  } catch (e) {
    throw new Error(`package '${packageName}' does not exist`);
  }
}

const removeRange = (semver: string): string => semver.replace(/[~^>=<]+/, "");

const resolveVersion = (
  packageName: string,
  semver: string,
): string | undefined => {
  const cleanSemver = removeRange(semver);

  if (semver === "*") {
    return getLatestVersion(packageName);
  } else if (cleanSemver === semver) {
    // This means semver is a dist-tag
    return resolveDistTag(packageName, semver);
  }

  return cleanSemver;
};

const toControlledSemver = (
  packageName: string,
  semver: string,
  granularity: DependencyGranularity,
): string => {
  // TODO: fix
  const resolvedSemver = resolveVersion(packageName, semver) || "";
  switch (granularity) {
    case "fixed":
      return resolvedSemver;
    case "patch":
      return `~${resolvedSemver}`;
    case "minor":
      return `^${resolvedSemver}`;
    default:
      // Unexpected granularity
      return semver;
  }
};

export { toControlledSemver };
