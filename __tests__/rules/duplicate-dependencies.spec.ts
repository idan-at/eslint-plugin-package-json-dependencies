import { RuleTester } from "eslint";
import path from "path";
import { rule } from "../../src/rules/duplicate-dependencies";

const tester = new RuleTester({ parser: path.resolve(".") });

tester.run("duplicate", rule, {
  valid: [
    // not a package.json file
    {
      code: `"not package.json"`,
      filename: "index.js",
    },
    // dependency only defined once
    {
      code: `{
      "name": "p1",
      "devDependencies": {
        "package": "1.0.0"
      }
    }`,
      filename: "package.json",
    },
    // dependency is excluded
    {
      code: `{
      "name": "p1",
      "dependencies": {
        "package": "1.0.0"
      },
      "devDependencies": {
        "package": "1.0.0"
      }
    }`,
      filename: "package.json",
      options: [{ exclude: ["package"] }],
    },
  ],
  invalid: [
    // dependency defined on multiple dependencies keys
    {
      code: `{
        "name": "p1",
        "dependencies": {
          "package": "1.0.0"
        },
        "devDependencies": {
          "package": "2.0.0"
        }
      }`,
      filename: "package.json",
      errors: [
        {
          messageId: "duplicateDependencyFound",
          data: {
            package: "package",
            origins: "[dependencies,devDependencies]",
          },
        },
      ],
    },
    // exclude without exact match
    {
      code: `{
        "name": "p1",
        "optionalDependencies": {
          "package": "1.0.0"
        },
        "peerDependencies": {
          "package": "2.0.0"
        }
      }`,
      filename: "package.json",
      options: [{ exclude: ["packag"] }],
      errors: [
        {
          messageId: "duplicateDependencyFound",
          data: {
            package: "package",
            origins: "[peerDependencies,optionalDependencies]",
          },
        },
      ],
    },
  ],
});
