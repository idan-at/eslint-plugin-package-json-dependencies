import {
  isPackageJsonFile,
  getDependenciesSafe,
  isGitDependency,
  isFileDependency,
  isWorkspaceDependency,
  isDistTagDependency,
  resolveDistTag,
} from "../src/utils";

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
      [],
    );
  });

  test("isGitDependency", () => {
    expect(
      isGitDependency("git://github.com/user/project.git#commit-ish"),
    ).toBeTruthy();
    expect(isGitDependency("*")).toBeFalsy();
  });

  test("isFileDependency", () => {
    expect(isFileDependency("file:../package")).toBeTruthy();
    expect(isFileDependency("*")).toBeFalsy();
  });

  test("isWorkspaceDependency", () => {
    expect(isWorkspaceDependency("workspace:*")).toBeTruthy();
    expect(isWorkspaceDependency("*")).toBeFalsy();
  });

  test("isDistTagDependency", () => {
    expect(isDistTagDependency("latest")).toBeTruthy();
    expect(isDistTagDependency("*")).toBeFalsy();
  });

  test("resolveDistTag", () => {
    expect(resolveDistTag("lodash", "latest2")).toBeUndefined();
    expect(resolveDistTag("lodash", "latest")).toBeTruthy();
    expect(() =>
      resolveDistTag("no-way__this__package_exists3", "latest"),
    ).toThrow(/does not exist/);
  });
});
