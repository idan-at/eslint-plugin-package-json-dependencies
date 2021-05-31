import { RuleTester } from "eslint";
import path from "path";
import { rule } from "../../src/rules/better-alternative";

const tester = new RuleTester({ parser: path.resolve(".") });

tester.run("better-alternative", rule, {
  valid: [
    // not a package.json file
    {
      code: `"not package.json"`,
      filename: "index.js",
    },
    // no alternatives given
    {
      code: `{
        "dependencies": {
          "a": "~1.0.0",
          "b": "~1.0.0"
        }
      }`,
      filename: "package.json",
    },
    // empty alternatives object
    {
      code: `{
        "dependencies": {
          "a": "~1.0.0",
          "b": "~1.0.0"
        }
      }`,
      filename: "package.json",
      options: [{ alternatives: {} }]
    },
    // alternatives are not listed as dependencies
    {
      code: `{
        "dependencies": {
          "a": "~1.0.0",
          "b": "~1.0.0"
        }
      }`,
      filename: "package.json",
      options: [{ alternatives: { 'foo': 'bar' }}]
    },
  ],
  invalid: [
    // better alternative exists on dependencies
    {
      code: `{
        "name": "p1",
        "dependencies": {
          "foo": "~1.0.0"
        }
      }`,
      filename: "package.json",
      options: [{ alternatives: { 'foo': 'bar' }}],
      errors: [{ messageId: "betterAlternativeExists", data: { package: "foo", alternative: "bar" } }],
    },
    // better alternative exists on devDependencies
    {
      code: `{
        "name": "p1",
        "devDependencies": {
          "foo": "~1.0.0"
        }
      }`,
      filename: "package.json",
      options: [{ alternatives: { 'foo': 'bar' }}],
      errors: [{ messageId: "betterAlternativeExists", data: { package: "foo", alternative: "bar" } }],
    },
    // better alternative exists on peerDependencies
    {
      code: `{
        "name": "p1",
        "peerDependencies": {
          "foo": "~1.0.0"
        }
      }`,
      filename: "package.json",
      options: [{ alternatives: { 'foo': 'bar' }}],
      errors: [{ messageId: "betterAlternativeExists", data: { package: "foo", alternative: "bar" } }],
    },
    // better alternative exists on optionalDependencies
    {
      code: `{
        "name": "p1",
        "optionalDependencies": {
          "foo": "~1.0.0"
        }
      }`,
      filename: "package.json",
      options: [{ alternatives: { 'foo': 'bar' }}],
      errors: [{ messageId: "betterAlternativeExists", data: { package: "foo", alternative: "bar" } }],
    },
  ]
});
