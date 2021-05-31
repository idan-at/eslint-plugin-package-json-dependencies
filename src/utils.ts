import path from "path";
import { Dependencies } from "./types";

const isPackageJsonFile = (filePath: string): boolean =>
  path.basename(filePath) === "package.json";

const getDependenciesSafe = (
  object: Record<string, Dependencies>,
  key: string
): string[] => Object.keys(object[key] || {}) || [];

export { isPackageJsonFile, getDependenciesSafe };
