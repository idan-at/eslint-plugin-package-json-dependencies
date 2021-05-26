import * as ts from "typescript";
import path from "path";
import fs from "fs";

const fileExists = (fileName: string): boolean => ts.sys.fileExists(fileName);
const readFile = (fileName: string): string | undefined =>
  ts.sys.readFile(fileName);

const resolveTscOptions = (cwd: string): ts.CompilerOptions => {
  const tsconfigPath = path.join(cwd, "tsconfig.json");

  if (!fs.existsSync(tsconfigPath)) {
    return {};
  }

  return { extendedSourceFiles: [tsconfigPath] };
};

const resolveModuleName = (cwd: string, moduleName: string): string | null => {
  const options: ts.CompilerOptions = resolveTscOptions(cwd);

  // File doesn't have to exist, resolveModuleName needs a file inside CWD.
  const fileInsideCwd = path.join(cwd, "index.ts");

  const { resolvedModule } = ts.resolveModuleName(
    moduleName,
    fileInsideCwd,
    options,
    { fileExists, readFile }
  );

  if (!resolvedModule) {
    return null;
  }

  return resolvedModule.resolvedFileName;
};

export { resolveModuleName, resolveTscOptions };
