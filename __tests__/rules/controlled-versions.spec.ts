import dedent from "dedent";
import { RuleTester } from "eslint";
import path from "path";
import { rule } from "../../src/rules/controlled-versions";

const tester = new RuleTester({ parser: path.resolve(".") });

// NOTE: Some packages here are real NPM packages that when `fix` is run,
// Are checked against the NPM registry.
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
          "axios": "=1.2.3",
          "foo": "1.2.3 || 1.2.4",
          "bar": "1 - 2"
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
          "axios": "=1.2.3",
          "foo": "1.2.3 || 1.2.4",
          "bar": "1 - 2"
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
          "lodash": "~4.17.21",
          "baz": "1.2.3 || 1.2.4",
          "bay": "~1.2.3 || ~1.2.4",
          "bar": "1 - 2",
          "bak": "~1 - ~2"
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
          "foo": "^4.17.21",
          "baz": "1.2.3 || 1.2.4",
          "bay": "~1.2.3 || ~1.2.4",
          "bal": "^1.2.3 || ^1.2.4",
          "bar": "1 - 2",
          "bak": "~1 - ~2",
          "bap": "^1 - ^2"
        }
      }`,
      filename: "package.json",
      options: [{ granularity: "minor" }],
    },
    // // excluded
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
    // // ignores git links
    {
      code: `{
        "name": "p1",
        "dependencies": {
          "foo1": "git://github.com/foo/foo1.git",
          "foo2": "git+ssh://git@github.com:foo/foo2.git",
          "foo3": "git+http://user@github.com/foo/foo3",
          "foo4": "git+https://user@github.com/foo/foo4",
          "foo5": "git+file:///path/to/file"
        }
      }`,
      filename: "package.json",
      options: [{ granularity: "minor" }],
    },
    // // ignores file links
    {
      code: `{
        "name": "p1",
        "dependencies": {
          "foo1": "file:../relative/path/to/file",
          "foo2": "file:/full/path/to/file"
        }
      }`,
      filename: "package.json",
      options: [{ granularity: "minor" }],
    },
  ],
  invalid: [
    // fixed without explicitly passing granularity
    {
      code: dedent`{
        "name": "p1",
        "dependencies": {
          "lodash": "~4.17.21",
          "axios": "^4.17.21",
          "foo": "latest",
          "bar": "*",
          "baz": ">1.0.0",
          "bay": "<=1.0.0",
          "bak": "~1.2.3 || 1.2.4",
          "bal": "1.2.3 - ^1.2.4",
          "valid1": "1.2.3",
          "valid2": "=1.2.3",
          "valid3": "14 - 16"
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
        { messageId: "nonControlledDependency", data: { package: "bak" } },
        { messageId: "nonControlledDependency", data: { package: "bal" } },
      ],
      output: dedent`{
        "name": "p1",
        "dependencies": {
          "lodash": "4.17.21",
          "axios": "4.17.21",
          "foo": "0.0.7",
          "bar": "0.1.2",
          "baz": "1.0.0",
          "bay": "1.0.0",
          "bak": "1.2.3 || 1.2.4",
          "bal": "1.2.3 - 1.2.4",
          "valid1": "1.2.3",
          "valid2": "=1.2.3",
          "valid3": "14 - 16"
        }
      }`,
    },
    // // fixed with explicitly passing granularity
    {
      code: dedent`{
        "name": "p1",
        "devDependencies": {
          "lodash": "~4.17.21",
          "axios": "^4.17.21",
          "foo": "latest",
          "bar": "*",
          "baz": ">1.0.0",
          "bay": "<=1.0.0",
          "bak": "~1.2.3 || 1.2.4",
          "bal": "1.2.3 - ^1.2.4",
          "valid1": "1.2.3",
          "valid2": "=1.2.3",
          "valid3": "14 - 16"
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
        { messageId: "nonControlledDependency", data: { package: "bak" } },
        { messageId: "nonControlledDependency", data: { package: "bal" } },
      ],
      output: dedent`{
        "name": "p1",
        "devDependencies": {
          "lodash": "4.17.21",
          "axios": "4.17.21",
          "foo": "0.0.7",
          "bar": "0.1.2",
          "baz": "1.0.0",
          "bay": "1.0.0",
          "bak": "1.2.3 || 1.2.4",
          "bal": "1.2.3 - 1.2.4",
          "valid1": "1.2.3",
          "valid2": "=1.2.3",
          "valid3": "14 - 16"
        }
      }`,
    },
    // // patch with explicitly passing granularity
    {
      code: dedent`{
        "name": "p1",
        "peerDependencies": {
          "axios": "^4.17.21",
          "foo": "latest",
          "bar": "*",
          "baz": ">1.0.0",
          "bay": "<=1.0.0",
          "bak": "^1.2.3 || 1.2.4",
          "bal": "1.2.3 - ^1.2.4",
          "valid1": "1.2.3",
          "valid2": "=1.2.3",
          "valid3": "~1.3.4",
          "valid4": "~14 - ~16"
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
        { messageId: "nonControlledDependency", data: { package: "bak" } },
        { messageId: "nonControlledDependency", data: { package: "bal" } },
      ],
      output: dedent`{
        "name": "p1",
        "peerDependencies": {
          "axios": "~4.17.21",
          "foo": "~0.0.7",
          "bar": "~0.1.2",
          "baz": "~1.0.0",
          "bay": "~1.0.0",
          "bak": "~1.2.3 || 1.2.4",
          "bal": "1.2.3 - ~1.2.4",
          "valid1": "1.2.3",
          "valid2": "=1.2.3",
          "valid3": "~1.3.4",
          "valid4": "~14 - ~16"
        }
      }`,
    },
    // // minor with explicitly passing granularity
    {
      code: dedent`{
        "name": "p1",
        "optionalDependencies": {
          "foo": "latest",
          "bar": "*",
          "baz": ">1.0.0",
          "bay": "<=1.0.0",
          "valid1": "1.2.3",
          "valid2": "=1.2.3",
          "valid3": "~1.3.4",
          "valid4": "^1.3.4",
          "valid5": "^14 - ^16"
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
      output: dedent`{
        "name": "p1",
        "optionalDependencies": {
          "foo": "^0.0.7",
          "bar": "^0.1.2",
          "baz": "^1.0.0",
          "bay": "^1.0.0",
          "valid1": "1.2.3",
          "valid2": "=1.2.3",
          "valid3": "~1.3.4",
          "valid4": "^1.3.4",
          "valid5": "^14 - ^16"
        }
      }`,
    },
  ],
});
