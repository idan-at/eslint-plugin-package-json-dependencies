import { resolveTypeRoots } from "../src/compiler-facade";
import { FIXTURES_ROOT_PATH, MISSING_TYPES_FIXTURE_PATH } from "./constants";
import path from "path";

describe("compiler facade", () => {
  test("resolveTypeRoots", () => {
    expect(resolveTypeRoots(FIXTURES_ROOT_PATH)).toStrictEqual([]);
    expect(resolveTypeRoots(MISSING_TYPES_FIXTURE_PATH)).toStrictEqual([
      path.resolve(MISSING_TYPES_FIXTURE_PATH, "node_modules", "@types"),
      path.resolve(MISSING_TYPES_FIXTURE_PATH, "typings"),
    ]);
  });
});
