import { RuleTester } from "eslint";
import { rule } from "../../src/rules/alphabetically-sorted-dependencies";
import dedent from "dedent";

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
      code: dedent`({
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
      output: dedent`({
        "name": "p1",
        "dependencies": {
          "@scope/a": "~1.0.0",
          "a": "~1.0.0"
        }
      })`,
    },
    // unsorted dev dependencies
    {
      code: dedent`({
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
      output: dedent`({
        "name": "p1",
        "devDependencies": {
          "@scope/a": "~1.0.0",
          "a": "~1.0.0"
        }
      })`,
    },
    // unsorted peer dependencies
    {
      code: dedent`({
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
      output: dedent`({
        "name": "p1",
        "peerDependencies": {
          "@scope/a": "~1.0.0",
          "a": "~1.0.0"
        }
      })`,
    },
    // unsorted optional dependencies
    {
      code: dedent`({
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
      output: dedent`({
        "name": "p1",
        "optionalDependencies": {
          "@scope/a": "~1.0.0",
          "a": "~1.0.0"
        }
      })`,
    },
    // unsorted dev dependencies but sorted dependencies
    {
      code: dedent`({
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
      output: dedent`({
        "name": "p1",
        "dependencies": {
          "a": "~1.0.0",
          "b": "~1.0.0"
        },
        "devDependencies": {
          "@scope/a": "~1.0.0",
          "a": "~1.0.0"
        }
      })`,
    },
  ],
});
