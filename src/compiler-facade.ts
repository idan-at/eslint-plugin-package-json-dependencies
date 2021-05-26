import * as ts from "typescript";
import path from "path";
import fs from "fs";
import { parse } from "comment-json";

const fileExists = (fileName: string): boolean => ts.sys.fileExists(fileName);
const readFile = (fileName: string): string | undefined =>
  ts.sys.readFile(fileName);

const resolveTypeRoots = (cwd: string): string[] => {
  const tsconfigPath = path.join(cwd, "tsconfig.json");

  if (!fs.existsSync(tsconfigPath)) {
    return [];
  }

  const content = fs.readFileSync(tsconfigPath, "utf8");
  const tsconfig = parse(content);
  const compilerOptions = tsconfig.compilerOptions as ts.CompilerOptions;

  if (compilerOptions.typeRoots) {
    return Array.from(
      compilerOptions.typeRoots.map((typeRoot) => path.resolve(cwd, typeRoot))
    );
  }

  return [];
};

const resolveModuleName = (cwd: string, moduleName: string): string | null => {
  const typeRoots = resolveTypeRoots(cwd);

  // File doesn't have to exist, resolveModuleName needs a file inside CWD.
  const fileInsideCwd = path.join(cwd, "index.ts");

  const { resolvedModule } = ts.resolveModuleName(
    moduleName,
    fileInsideCwd,
    {},
    { fileExists, readFile }
  );

  if (!resolvedModule) {
    for (const typeRoot of typeRoots) {
      const modulePath = path.join(typeRoot, `${moduleName}.d.ts`);

      if (fs.existsSync(modulePath)) {
        return modulePath;
      }
    }

    return null;
  }

  return resolvedModule.resolvedFileName;
};

export { resolveModuleName, resolveTypeRoots };
