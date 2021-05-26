import { hasTypes } from "../src/has-types";

describe("hasTypes", () => {
  test("static checks", () => {
    expect(hasTypes("package", ["@types/package"])).toBe(true);
    expect(hasTypes("package", ["@types/another-package"])).toBe(false);
    expect(hasTypes("@scope/package", ["@types/scope__package"])).toBe(true);
    expect(hasTypes("@scope/package", ["@types/scope__another-package"])).toBe(
      false
    );
  });
});
