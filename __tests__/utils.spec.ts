import { isPackageJsonFile, getDependenciesSafe } from "../src/utils";

describe("utils", () => {
  test("isPackageJsonFile", () => {
    expect(isPackageJsonFile("package.json")).toBe(true);
    expect(isPackageJsonFile("./some/relative/path/package.json")).toBe(true);
    expect(isPackageJsonFile("/some/absolute/path/package.json")).toBe(true);
  });

  test("getDependenciesSafe", () => {
    const packageJson = {
      dependencies: { foo: "bar" },
    };

    expect(getDependenciesSafe(packageJson, "dependencies")).toStrictEqual([
      "foo",
    ]);
    expect(getDependenciesSafe(packageJson, "devDependencies")).toStrictEqual(
      []
    );
  });
});
