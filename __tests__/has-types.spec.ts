import { hasTypes, isPackedTypesFile } from "../src/has-types";
import { NO_MISSING_TYPES_FIXTURE_PATH as cwd } from "./constants";

describe("hasTypes", () => {
  test("static checks", () => {
    expect(hasTypes(cwd, "package", ["@types/package"])).toBe(true);
    expect(hasTypes(cwd, "package", ["@types/another-package"])).toBe(false);
    expect(hasTypes(cwd, "@scope/package", ["@types/scope__package"])).toBe(
      true,
    );
    expect(
      hasTypes(cwd, "@scope/package", ["@types/scope__another-package"]),
    ).toBe(false);
  });

  // Those tests rely on the fact that both typescript and lodash are used within this package.
  test("dynamic checks", () => {
    expect(hasTypes(cwd, "typescript", [])).toBe(true);
    expect(hasTypes(cwd, "lodash", [])).toBe(false);
    expect(hasTypes(cwd, "made-up-package", [])).toBe(true);
  });
});

test("isPackedTypesFile", () => {
  expect(isPackedTypesFile("/path/to/@types/package/index.d.ts")).toBe(false);
  expect(isPackedTypesFile("/path/to/package/index.js")).toBe(false);
  expect(isPackedTypesFile("/path/to/package/index.d.ts")).toBe(true);
});
