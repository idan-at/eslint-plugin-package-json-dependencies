import { ESLint, Linter } from "eslint";
import { execSync } from "child_process";
import {
  NO_MISSING_TYPES_FIXTURE_PATH,
  ALPHABETICALLY_SORTED_DEPENDENCIES_FIXTURES_PATH,
  CONTROLLED_VERSIONS_FIXTURE_PATH,
  BETTER_ALTERNATIVE_FIXTURES_PATH,
} from "./constants";

const createLiner = (cwd: string, rules: Partial<Linter.RulesRecord>): ESLint =>
  new ESLint({
    extensions: [".json"],
    cwd,
    overrideConfig: {
      overrides: [
        {
          plugins: ["eslint-plugin-package-json-dependencies"],
          files: ["*.json"],
          parser: "eslint-plugin-package-json-dependencies",
          rules,
        },
      ],
    },
    ignore: false,
    useEslintrc: false,
  });

describe("integration tests", () => {
  beforeAll(() =>
    execSync("npm install", {
      cwd: NO_MISSING_TYPES_FIXTURE_PATH,
    })
  );

  test("no-missing-types", async () => {
    const results = await createLiner(NO_MISSING_TYPES_FIXTURE_PATH, {
      "package-json-dependencies/no-missing-types": [
        "error",
        { excludePatterns: [] },
      ],
    }).lintFiles("package.json");

    expect(results).toHaveLength(1);
    expect(results[0]).toHaveProperty("errorCount", 1);
    expect(results[0]).toHaveProperty("warningCount", 0);
    expect(results[0].messages).toHaveLength(1);
    expect(results[0].messages[0]).toHaveProperty(
      "ruleId",
      "package-json-dependencies/no-missing-types"
    );
    expect(results[0].messages[0]).toHaveProperty("messageId", "missingTypes");
    expect(results[0].messages[0]).toHaveProperty(
      "message",
      "Missing types for streamifier"
    );
  });

  test("alphabetically-sorted-dependencies", async () => {
    const results = await createLiner(
      ALPHABETICALLY_SORTED_DEPENDENCIES_FIXTURES_PATH,
      {
        "package-json-dependencies/alphabetically-sorted-dependencies": "error",
      }
    ).lintFiles("package.json");

    expect(results).toHaveLength(1);
    expect(results[0]).toHaveProperty("errorCount", 1);
    expect(results[0]).toHaveProperty("warningCount", 0);
    expect(results[0].messages).toHaveLength(1);
    expect(results[0].messages[0]).toHaveProperty(
      "ruleId",
      "package-json-dependencies/alphabetically-sorted-dependencies"
    );
    expect(results[0].messages[0]).toHaveProperty(
      "messageId",
      "unsortedDependencies"
    );
    expect(results[0].messages[0]).toHaveProperty(
      "message",
      "Dependencies under the 'dependencies' key are not alphabetically sorted"
    );
  });

  test("controlled-versions", async () => {
    const results = await createLiner(CONTROLLED_VERSIONS_FIXTURE_PATH, {
      "package-json-dependencies/controlled-versions": [
        "error",
        { granularity: "patch", excludePatterns: ["ignored"] },
      ],
    }).lintFiles("package.json");

    expect(results).toHaveLength(1);
    expect(results[0]).toHaveProperty("errorCount", 2);
    expect(results[0]).toHaveProperty("warningCount", 0);
    expect(results[0].messages).toHaveLength(2);
    expect(results[0].messages[0]).toHaveProperty(
      "ruleId",
      "package-json-dependencies/controlled-versions"
    );
    expect(results[0].messages[0]).toHaveProperty(
      "messageId",
      "nonControlledDependency"
    );
    expect(results[0].messages[0]).toHaveProperty(
      "message",
      "Non controlled version found for dependency 'foo'"
    );
    expect(results[0].messages[1]).toHaveProperty(
      "ruleId",
      "package-json-dependencies/controlled-versions"
    );
    expect(results[0].messages[1]).toHaveProperty(
      "messageId",
      "nonControlledDependency"
    );
    expect(results[0].messages[1]).toHaveProperty(
      "message",
      "Non controlled version found for dependency 'bar'"
    );
  });

  test("better-alternative", async () => {
    const results = await createLiner(
      BETTER_ALTERNATIVE_FIXTURES_PATH,
      {
        "package-json-dependencies/better-alternative": ["error", { alternatives: { 'foo': 'bar' }}],
      }
    ).lintFiles("package.json");

    expect(results).toHaveLength(1);
    expect(results[0]).toHaveProperty("errorCount", 1);
    expect(results[0]).toHaveProperty("warningCount", 0);
    expect(results[0].messages).toHaveLength(1);
    expect(results[0].messages[0]).toHaveProperty(
      "ruleId",
      "package-json-dependencies/better-alternative"
    );
    expect(results[0].messages[0]).toHaveProperty(
      "messageId",
      "betterAlternativeExists"
    );
    expect(results[0].messages[0]).toHaveProperty(
      "message",
      "Replace 'foo' with 'bar'"
    );
  })
});
