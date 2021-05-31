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
          "lodash": "4.17.21"
        }
      }`,
      filename: "package.json"
    },
    // fixed with explicitly passing granularity
    {
      code: `{
        "name": "p1",
        "dependencies": {
          "lodash": "4.17.21"
        }
      }`,
      filename: "package.json",
      options: [{ granularity: "fixed" }]
    },
    // patch
    {
      code: `{
        "name": "p1",
        "dependencies": {
          "axios": "4.17.21",
          "lodash": "~4.17.21"
        }
      }`,
      filename: "package.json",
      options: [{ granularity: "patch" }]
    },
    // minor
    {
      code: `{
        "name": "p1",
        "dependencies": {
          "axios": "~4.17.21",
          "lodash": "~4.17.21",
          "foo": "^4.17.21"
        }
      }`,
      filename: "package.json",
      options: [{ granularity: "minor" }]
    }
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
          "bar": "*"
        }
      }`,
      filename: "package.json",
      errors: [
        { messageId: "nonControlledDependency", data: { package: "lodash" } },
        { messageId: "nonControlledDependency", data: { package: "axios" } },
        { messageId: "nonControlledDependency", data: { package: "foo" } },
        { messageId: "nonControlledDependency", data: { package: "bar" } },
      ]
    },
    // fixed with explicitly passing granularity
    {
      code: `{
        "name": "p1",
        "dependencies": {
          "lodash": "~4.17.21",
          "axios": "^4.17.21",
          "foo": "latest",
          "bar": "*"
        }
      }`,
      filename: "package.json",
      options: [{ granularity: "fixed" }],
      errors: [
        { messageId: "nonControlledDependency", data: { package: "lodash" } },
        { messageId: "nonControlledDependency", data: { package: "axios" } },
        { messageId: "nonControlledDependency", data: { package: "foo" } },
        { messageId: "nonControlledDependency", data: { package: "bar" } },
      ]
    },
    // patch with explicitly passing granularity
    {
      code: `{
        "name": "p1",
        "dependencies": {
          "axios": "^4.17.21",
          "foo": "latest",
          "bar": "*"
        }
      }`,
      filename: "package.json",
      options: [{ granularity: "patch" }],
      errors: [
        { messageId: "nonControlledDependency", data: { package: "axios" } },
        { messageId: "nonControlledDependency", data: { package: "foo" } },
        { messageId: "nonControlledDependency", data: { package: "bar" } },
      ]
    },
    // minor with explicitly passing granularity
    {
      code: `{
        "name": "p1",
        "dependencies": {
          "foo": "latest",
          "bar": "*"
        }
      }`,
      filename: "package.json",
      options: [{ granularity: "minor" }],
      errors: [
        { messageId: "nonControlledDependency", data: { package: "foo" } },
        { messageId: "nonControlledDependency", data: { package: "bar" } },
      ]
    },
  ]
})
