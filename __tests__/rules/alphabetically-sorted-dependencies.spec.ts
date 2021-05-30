import { RuleTester } from "eslint";
import { rule } from "../../src/rules/alphabetically-sorted-dependencies";

const tester = new RuleTester();

tester.run("alphabetically-sorted-dependencies", rule, {
  valid: [
    // not a package.json file
    {
      code: `"not package.json"`,
      filename: "index.js",
    },
    // sorted dependencies
    {
      code: `({
        "dependencies": {
          "@scope/a": "~1.0.0",
          "@scope/b": "~1.0.0",
          "a": "~1.0.0",
          "b": "~1.0.0"
        }
      })`,
      filename: "package.json",
    },
    // sorted dev dependencies
    {
      code: `({
          "devDependencies": {
            "@scope/a": "~1.0.0",
            "@scope/b": "~1.0.0",
            "a": "~1.0.0",
            "b": "~1.0.0"
          }
        })`,
      filename: "package.json",
    },
    // sorted peer dependencies
    {
      code: `({
        "peerDependencies": {
          "@scope/a": "~1.0.0",
          "@scope/b": "~1.0.0",
          "a": "~1.0.0",
          "b": "~1.0.0"
        }
      })`,
      filename: "package.json",
    },
    // sorted optional dependencies
    {
      code: `({
          "optionalDependencies": {
            "@scope/a": "~1.0.0",
            "@scope/b": "~1.0.0",
            "a": "~1.0.0",
            "b": "~1.0.0"
          }
        })`,
      filename: "package.json",
    },
  ],
  invalid: [
    // invalid package.json file
    {
      code: `module.exports = {}`,
      filename: "package.json",
      errors: [{ messageId: "invalidJson" }],
    },
    // unsorted dependencies
    {
      code: `({
        "name": "p1",
        "dependencies": {
          "a": "~1.0.0",
          "@scope/a": "~1.0.0"
        }
      })`,
      filename: "package.json",
      errors: [
        { messageId: "unsortedDependencies", data: { key: "dependencies" } },
      ],
    },
    // unsorted dev dependencies
    {
      code: `({
        "name": "p1",
        "devDependencies": {
          "a": "~1.0.0",
          "@scope/a": "~1.0.0"
        }
      })`,
      filename: "package.json",
      errors: [
        { messageId: "unsortedDependencies", data: { key: "devDependencies" } },
      ],
    },
    // unsorted peer dependencies
    {
      code: `({
        "name": "p1",
        "peerDependencies": {
          "a": "~1.0.0",
          "@scope/a": "~1.0.0"
        }
      })`,
      filename: "package.json",
      errors: [
        {
          messageId: "unsortedDependencies",
          data: { key: "peerDependencies" },
        },
      ],
    },
    // unsorted optional dependencies
    {
      code: `({
        "name": "p1",
        "optionalDependencies": {
          "a": "~1.0.0",
          "@scope/a": "~1.0.0"
        }
      })`,
      filename: "package.json",
      errors: [
        {
          messageId: "unsortedDependencies",
          data: { key: "optionalDependencies" },
        },
      ],
    },
    // unsorted dev dependencies but sorted dependencies
    {
      code: `({
          "name": "p1",
          "dependencies": {
            "a": "~1.0.0",
            "b": "~1.0.0"
          },
          "devDependencies": {
            "a": "~1.0.0",
            "@scope/a": "~1.0.0"
          }
        })`,
      filename: "package.json",
      errors: [
        { messageId: "unsortedDependencies", data: { key: "devDependencies" } },
      ],
    },
  ],
});
