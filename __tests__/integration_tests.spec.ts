import { ESLint } from "eslint";
import { execSync } from "child_process";
import * as plugin from "..";
import { NO_MISSING_TYPES_FIXTURE_PATH, ALPHABETICALLY_SORTED_DEPENDENCIES_FIXTURES_PATH } from "./constants";

const createLiner = (cwd: string): ESLint =>
  new ESLint({
    extensions: [".json"],
    cwd,
    baseConfig: {
      rules: {
        "package-json-dependencies/no-missing-types": [
          "error",
          { excludePatterns: [] },
        ],
      },
    },
    plugins: { "eslint-plugin-package-json-dependencies": plugin },
    ignore: false,
    useEslintrc: false,
  });

describe("integration tests", () => {
  beforeAll(() =>
    execSync("npm install", {
      cwd: NO_MISSING_TYPES_FIXTURE_PATH,
    })
  );

  describe.skip("no-missing-types", () => {
    test("works with json files", async () => {
      const results = await createLiner(NO_MISSING_TYPES_FIXTURE_PATH).lintFiles(
        "package.json"
      );

      console.log(results[0]);
    });
  });

  describe.skip("alphabetically-sorted-dependencies", () => {
    test("works with json files", async () => {
      const results = await createLiner(ALPHABETICALLY_SORTED_DEPENDENCIES_FIXTURES_PATH).lintFiles(
        "package.json"
      );

      console.log(results[0]);
    });
  });
});
