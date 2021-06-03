import { RuleTester } from "eslint";
import path from "path";
import { rule } from "../../src/rules/controlled-versions";

const tester = new RuleTester({ parser: path.resolve(".") });

tester.run("controlled-versions", rule, {
  valid: [
    // not a package.json file
    {
      code: `"not package.json"`,
      filename: "index.js",
    },
    // fixed without explicitly passing granularity
    {
      code: `{
        "name": "p1",
        "dependencies": {
          "lodash": "4.17.21",
          "axios": "=1.2.3"
        }
      }`,
      filename: "package.json",
    },
    // fixed with explicitly passing granularity
    {
      code: `{
        "name": "p1",
        "dependencies": {
          "lodash": "4.17.21",
          "axios": "=1.2.3"
        }
      }`,
      filename: "package.json",
      options: [{ granularity: "fixed" }],
    },
    // patch
    {
      code: `{
        "name": "p1",
        "dependencies": {
          "axios": "4.17.21",
          "foo": "=4.17.21",
          "lodash": "~4.17.21"
        }
      }`,
      filename: "package.json",
      options: [{ granularity: "patch" }],
    },
    // minor
    {
      code: `{
        "name": "p1",
        "dependencies": {
          "axios": "4.17.21",
          "bar": "=4.17.21",
          "lodash": "~4.17.21",
          "foo": "^4.17.21"
        }
      }`,
      filename: "package.json",
      options: [{ granularity: "minor" }],
    },
    // excluded
    {
      code: `{
        "name": "p1",
        "dependencies": {
          "foo1": "latest",
          "foo2": "*"
        }
      }`,
      filename: "package.json",
      options: [{ granularity: "minor", excludePatterns: ["foo*"] }],
    },
  ],
  invalid: [
    // fixed without explicitly passing granularity
    {
      code: `{
        "name": "p1",
        "dependencies": {
          "lodash": "~4.17.21",
          "axios": "^4.17.21",
          "foo": "latest",
          "bar": "*",
          "baz": ">1.0.0",
          "bay": "<=1.0.0",
          "valid1": "1.2.3",
          "valid2": "=1.2.3"
        }
      }`,
      filename: "package.json",
      errors: [
        { messageId: "nonControlledDependency", data: { package: "lodash" } },
        { messageId: "nonControlledDependency", data: { package: "axios" } },
        { messageId: "nonControlledDependency", data: { package: "foo" } },
        { messageId: "nonControlledDependency", data: { package: "bar" } },
        { messageId: "nonControlledDependency", data: { package: "baz" } },
        { messageId: "nonControlledDependency", data: { package: "bay" } },
      ],
    },
    // fixed with explicitly passing granularity
    {
      code: `{
        "name": "p1",
        "devDependencies": {
          "lodash": "~4.17.21",
          "axios": "^4.17.21",
          "foo": "latest",
          "bar": "*",
          "baz": ">1.0.0",
          "bay": "<=1.0.0",
          "valid1": "1.2.3",
          "valid2": "=1.2.3"
        }
      }`,
      filename: "package.json",
      options: [{ granularity: "fixed" }],
      errors: [
        { messageId: "nonControlledDependency", data: { package: "lodash" } },
        { messageId: "nonControlledDependency", data: { package: "axios" } },
        { messageId: "nonControlledDependency", data: { package: "foo" } },
        { messageId: "nonControlledDependency", data: { package: "bar" } },
        { messageId: "nonControlledDependency", data: { package: "baz" } },
        { messageId: "nonControlledDependency", data: { package: "bay" } },
      ],
    },
    // patch with explicitly passing granularity
    {
      code: `{
        "name": "p1",
        "peerDependencies": {
          "axios": "^4.17.21",
          "foo": "latest",
          "bar": "*",
          "baz": ">1.0.0",
          "bay": "<=1.0.0",
          "valid1": "1.2.3",
          "valid2": "=1.2.3",
          "valid3": "~1.3.4"
        }
      }`,
      filename: "package.json",
      options: [{ granularity: "patch" }],
      errors: [
        { messageId: "nonControlledDependency", data: { package: "axios" } },
        { messageId: "nonControlledDependency", data: { package: "foo" } },
        { messageId: "nonControlledDependency", data: { package: "bar" } },
        { messageId: "nonControlledDependency", data: { package: "baz" } },
        { messageId: "nonControlledDependency", data: { package: "bay" } },
      ],
    },
    // minor with explicitly passing granularity
    {
      code: `{
        "name": "p1",
        "optionalDependencies": {
          "foo": "latest",
          "bar": "*",
          "baz": ">1.0.0",
          "bay": "<=1.0.0",
          "valid1": "1.2.3",
          "valid2": "=1.2.3",
          "valid3": "~1.3.4",
          "valid4": "^1.3.4"
        }
      }`,
      filename: "package.json",
      options: [{ granularity: "minor" }],
      errors: [
        { messageId: "nonControlledDependency", data: { package: "foo" } },
        { messageId: "nonControlledDependency", data: { package: "bar" } },
        { messageId: "nonControlledDependency", data: { package: "baz" } },
        { messageId: "nonControlledDependency", data: { package: "bay" } },
      ],
    },
  ],
});
