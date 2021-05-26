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

const hasTypes = (dependency: string, typesDependencies: string[]): boolean =>
  hasTypesDependency(dependency, typesDependencies);

export { hasTypes };
