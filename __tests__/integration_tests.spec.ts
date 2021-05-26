import { ESLint } from "eslint";
import { execSync } from "child_process";
import * as plugin from "..";
import { MISSING_TYPES_FIXTURE_PATH } from "./constants";

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
      cwd: MISSING_TYPES_FIXTURE_PATH,
    })
  );

  describe.skip("no-missing-types", () => {
    test("works with json files", async () => {
      const results = await createLiner(MISSING_TYPES_FIXTURE_PATH).lintFiles(
        "package.json"
      );

      console.log(results[0]);
    });
  });
});
