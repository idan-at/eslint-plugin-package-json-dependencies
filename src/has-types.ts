import * as ts from "typescript";
import path from "path";

const hasTypesDependency = (
  dependency: string,
  typesDependencies: string[]
): boolean => {
  if (dependency.startsWith("@")) {
    return typesDependencies.includes(
      `@types/${dependency.replace("@", "").replace("/", "__")}`
    );
  } else {
    return typesDependencies.includes(`@types/${dependency}`);
  }
};

const hasPackedTypes = (cwd: string, dependency: string): boolean => {
  const fileExists = (fileName: string): boolean => ts.sys.fileExists(fileName);
  const readFile = (fileName: string): string | undefined =>
    ts.sys.readFile(fileName);
  const options: ts.CompilerOptions = { module: ts.ModuleKind.CommonJS };

  // File doesn't have to exist, resolveModuleName needs a file inside CWD.
  const fileInsideCwd = path.join(cwd, "index.ts");

  const { resolvedModule } = ts.resolveModuleName(
    dependency,
    fileInsideCwd,
    options,
    { fileExists, readFile }
  );

  if (!resolvedModule) {
    return false;
  }

  // If it contains @types it means the package does not come packed with its own types.
  return !resolvedModule.resolvedFileName.includes("/@types/");
};

const hasTypes = (
  cwd: string,
  dependency: string,
  typesDependencies: string[]
): boolean =>
  hasTypesDependency(dependency, typesDependencies) ||
  hasPackedTypes(cwd, dependency);

export { hasTypes };
