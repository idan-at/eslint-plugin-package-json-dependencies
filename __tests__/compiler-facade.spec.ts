import { resolveTscOptions } from "../src/compiler-facade";
import { FIXTURES_ROOT_PATH, MISSING_TYPES_FIXTURE_PATH } from "./constants";
import path from "path";

describe("compiler facade", () => {
  test("resolveTscOptions", () => {
    expect(resolveTscOptions(FIXTURES_ROOT_PATH)).toStrictEqual({});
    expect(resolveTscOptions(MISSING_TYPES_FIXTURE_PATH)).toStrictEqual({
      extendedSourceFiles: [
        path.join(MISSING_TYPES_FIXTURE_PATH, "tsconfig.json"),
      ],
    });
  });
});
