import { resolveTypeRoots } from "../src/compiler-facade";
import { FIXTURES_ROOT_PATH, NO_MISSING_TYPES_FIXTURE_PATH } from "./constants";
import path from "path";

describe("compiler facade", () => {
  test("resolveTypeRoots", () => {
    expect(resolveTypeRoots(FIXTURES_ROOT_PATH)).toStrictEqual([]);
    expect(resolveTypeRoots(NO_MISSING_TYPES_FIXTURE_PATH)).toStrictEqual([
      path.resolve(NO_MISSING_TYPES_FIXTURE_PATH, "node_modules", "@types"),
      path.resolve(NO_MISSING_TYPES_FIXTURE_PATH, "typings"),
    ]);
  });
});
