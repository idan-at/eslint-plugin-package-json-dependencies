import { resolveModuleName } from "./compiler-facade";

const hasTypesDependency = (
  dependency: string,
  typesDependencies: string[],
): boolean => {
  if (dependency.startsWith("@")) {
    return typesDependencies.includes(
      `@types/${dependency.replace("@", "").replace("/", "__")}`,
    );
  } else {
    return typesDependencies.includes(`@types/${dependency}`);
  }
};

// If it contains @types it means the package does not come packed with its own types.
const isPackedTypesFile = (filename: string): boolean =>
  !filename.includes("/@types/") && filename.endsWith(".d.ts");

const hasPackedTypes = (cwd: string, dependency: string): boolean => {
  const resolvedFileName = resolveModuleName(cwd, dependency);

  return !!resolvedFileName && isPackedTypesFile(resolvedFileName);
};

const hasTypes = (
  cwd: string,
  dependency: string,
  typesDependencies: string[],
): boolean =>
  hasTypesDependency(dependency, typesDependencies) ||
  hasPackedTypes(cwd, dependency);

export { hasTypes, isPackedTypesFile };
