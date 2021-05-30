import path from "path";

type Dependencies = Record<string, string>;

const isPackageJsonFile = (filePath: string): boolean =>
  path.basename(filePath) === "package.json";

const isValidJson = (text: string): boolean => {
  try {
    JSON.parse(text);

    return true;
  } catch (e) {
    return false;
  }
};

const getDependenciesSafe = (
  object: Record<string, Dependencies>,
  key: string
): string[] => Object.keys(object[key] || {}) || [];

export { isPackageJsonFile, isValidJson, getDependenciesSafe };
