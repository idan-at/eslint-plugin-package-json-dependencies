import { toControlledSemver } from "../src/to-controlled-semver";

describe("toControlledSemver", () => {
  // Testing this REAL package since it wasn't published a long time ago.
  // This might break, but I'm just avoiding writing a fake NPM server.
  const packageName = "streamifier";

  test("fixed granularity", () => {
    expect(toControlledSemver(packageName, "~1.0.0", "fixed")).toStrictEqual(
      "1.0.0"
    );
    expect(toControlledSemver(packageName, "^1.0.0", "fixed")).toStrictEqual(
      "1.0.0"
    );
    expect(toControlledSemver(packageName, ">1.0.0", "fixed")).toStrictEqual(
      "1.0.0"
    );
    expect(toControlledSemver(packageName, ">=1.0.0", "fixed")).toStrictEqual(
      "1.0.0"
    );
    expect(toControlledSemver(packageName, "<1.0.0", "fixed")).toStrictEqual(
      "1.0.0"
    );
    expect(toControlledSemver(packageName, "<=1.0.0", "fixed")).toStrictEqual(
      "1.0.0"
    );
    expect(toControlledSemver(packageName, "*", "fixed")).toStrictEqual(
      "0.1.1"
    );
    expect(toControlledSemver(packageName, "latest", "fixed")).toStrictEqual(
      "0.1.1"
    );
  });

  test("patch granularity", () => {
    expect(toControlledSemver(packageName, "^1.0.0", "patch")).toStrictEqual(
      "~1.0.0"
    );
    expect(toControlledSemver(packageName, ">1.0.0", "patch")).toStrictEqual(
      "~1.0.0"
    );
    expect(toControlledSemver(packageName, ">=1.0.0", "patch")).toStrictEqual(
      "~1.0.0"
    );
    expect(toControlledSemver(packageName, "<1.0.0", "patch")).toStrictEqual(
      "~1.0.0"
    );
    expect(toControlledSemver(packageName, "<=1.0.0", "patch")).toStrictEqual(
      "~1.0.0"
    );
    expect(toControlledSemver(packageName, "*", "patch")).toStrictEqual(
      "~0.1.1"
    );
    expect(toControlledSemver(packageName, "latest", "patch")).toStrictEqual(
      "~0.1.1"
    );
  });

  test("minor granularity", () => {
    expect(toControlledSemver(packageName, ">1.0.0", "minor")).toStrictEqual(
      "^1.0.0"
    );
    expect(toControlledSemver(packageName, ">=1.0.0", "minor")).toStrictEqual(
      "^1.0.0"
    );
    expect(toControlledSemver(packageName, "<1.0.0", "minor")).toStrictEqual(
      "^1.0.0"
    );
    expect(toControlledSemver(packageName, "<=1.0.0", "minor")).toStrictEqual(
      "^1.0.0"
    );
    expect(toControlledSemver(packageName, "*", "minor")).toStrictEqual(
      "^0.1.1"
    );
    expect(toControlledSemver(packageName, "latest", "minor")).toStrictEqual(
      "^0.1.1"
    );
  });
});
