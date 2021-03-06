import { RuleTester } from "eslint";
import path from "path";
import { rule } from "../../src/rules/no-missing-types";

const tester = new RuleTester({ parser: path.resolve(".") });

tester.run("no-missing-types", rule, {
  valid: [
    // not a package.json file
    {
      code: `"not package.json"`,
      filename: "index.js",
    },
    // has @types without the dependency
    {
      code: `{
      "name": "p1",
      "devDependencies": {
        "@types/package": "~1.0.0"
      }
    }`,
      filename: "package.json",
    },
    // has scoped @types without the dependency
    {
      code: `{
      "name": "p1",
      "devDependencies": {
        "@types/scope__package": "~1.0.0"
      }
    }`,
      filename: "package.json",
    },
    // has @types for a dependency
    {
      code: `{
      "name": "p1",
      "dependencies": {
        "package": "~1.0.0"
      },
      "devDependencies": {
        "@types/package": "~1.0.0"
      }
    }`,
      filename: "package.json",
    },
    // has @types for a scoped dependency
    {
      code: `{
      "name": "p1",
      "dependencies": {
        "@scope/package": "~1.0.0"
      },
      "devDependencies": {
        "@types/scope__package": "~1.0.0"
      }
    }`,
      filename: "package.json",
    },
    // has @types for a dev-dependency
    {
      code: `{
      "name": "p1",
      "devDependencies": {
        "package": "~1.0.0",
        "@types/package": "~1.0.0"
      }
    }`,
      filename: "package.json",
    },
    // has @types for a scoped dev-dependency
    {
      code: `{
      "name": "p1",
      "devDependencies": {
        "@scope/package": "~1.0.0",
        "@types/scope__package": "~1.0.0"
      }
    }`,
      filename: "package.json",
    },
    // misses @types but is excluded
    {
      code: `{
      "name": "p1",
      "devDependencies": {
        "package": "~1.0.0"
      }
    }`,
      filename: "package.json",
      options: [{ excludePatterns: ["pack*"] }],
    },
    // misses scoped @types but is excluded
    {
      code: `{
      "name": "p1",
      "devDependencies": {
        "@scope/package": "~1.0.0"
      }
    }`,
      filename: "package.json",
      options: [{ excludePatterns: ["@scope/package"] }],
    },
    // has dynamic types (relies on typescript being a dependency of this package)
    {
      code: `{
      "name": "p1",
      "devDependencies": {
        "typescript": "~1.0.0"
      }
    }`,
      filename: "package.json",
    },
  ],
  invalid: [
    // missing types for a dependency
    {
      code: `{
        "name": "p1",
        "dependencies": {
          "package": "~1.0.0"
        }
      }`,
      filename: "package.json",
      errors: [{ messageId: "missingTypes", data: { package: "package" } }],
    },
    // missing types for a scoped dependency
    {
      code: `{
        "name": "p1",
        "dependencies": {
          "@scope/package": "~1.0.0"
        }
      }`,
      filename: "package.json",
      errors: [
        { messageId: "missingTypes", data: { package: "@scope/package" } },
      ],
    },
    // missing types for a dev dependency
    {
      code: `{
        "name": "p1",
        "devDependencies": {
          "package": "~1.0.0"
        }
      }`,
      filename: "package.json",
      errors: [{ messageId: "missingTypes", data: { package: "package" } }],
    },
    // missing types for a scoped dev dependency
    {
      code: `{
        "name": "p1",
        "devDependencies": {
          "@scope/package": "~1.0.0"
        }
      }`,
      filename: "package.json",
      errors: [
        { messageId: "missingTypes", data: { package: "@scope/package" } },
      ],
    },
  ],
});
