import { ESLint, CLIEngine } from "eslint";
import { execSync } from "child_process";
import path from "path";
import * as plugin from "..";

const FIXTURES_ROOT_PATH = path.resolve("./__tests__/fixtures");
const MISSING_TYPES_FIXTURE_PATH = path.join(
  FIXTURES_ROOT_PATH,
  "missing-types"
);

const createLiner = (cwd: string): ESLint =>
  new ESLint({
    extensions: [".json"],
    cwd,
    baseConfig: {
      rules: {
        "package-json-dependencies/no-missing-types": [
          "error",
          { exclude: [] },
        ],
      },
    },
    plugins: { "eslint-plugin-package-json-dependencies": plugin },
    ignore: false,
    useEslintrc: false,
  });

describe.skip("integration tests", () => {
  beforeAll(() =>
    execSync("npm install", {
      cwd: MISSING_TYPES_FIXTURE_PATH,
    })
  );

  describe("no-missing-types", () => {
    test("works with json files", async () => {
      const results = await createLiner(MISSING_TYPES_FIXTURE_PATH).lintFiles(
        "package.json"
      );

      console.log(results[0]);
    });
  });
});
