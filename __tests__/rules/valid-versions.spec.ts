import { RuleTester } from "eslint";
import path from "path";
import { rule } from "../../src/rules/valid-versions";

const tester = new RuleTester({ parser: path.resolve(".") });

tester.run("valid-versions", rule, {
  valid: [
    // not a package.json file
    {
      code: `"not package.json"`,
      filename: "index.js",
    },
    // valid version - fixed
    {
      code: `{
      "name": "p1",
      "devDependencies": {
        "package": "1.0.0"
      }
    }`,
      filename: "package.json",
    },
    // valid version - tilde
    {
      code: `{
      "name": "p1",
      "devDependencies": {
        "package": "~1.0.0"
      }
    }`,
      filename: "package.json",
    },
    // valid version - carrot
    {
      code: `{
      "name": "p1",
      "devDependencies": {
        "package": "^1.0.0"
      }
    }`,
      filename: "package.json",
    },
    // valid version - all
    {
      code: `{
      "name": "p1",
      "devDependencies": {
        "package": "*"
      }
    }`,
      filename: "package.json",
    },
    // valid version - dist-tag
    {
      code: `{
      "name": "p1",
      "devDependencies": {
        "package": "latest"
      }
    }`,
      filename: "package.json",
    },
    // valid version - workspace dependency
    {
      code: `{
      "name": "p1",
      "devDependencies": {
        "package": "workspace:*"
      }
    }`,
      filename: "package.json",
    },
    // ignored version - git
    {
      code: `{
      "name": "p1",
      "devDependencies": {
        "package": "git://github.com/user/project.git#commit-ish"
      }
    }`,
      filename: "package.json",
    },
    // ignored version - file
    {
      code: `{
      "name": "p1",
      "devDependencies": {
        "package": "file:../package"
      }
    }`,
      filename: "package.json",
    },
  ],
  invalid: [
    // invalid workspace dependency (space)
    {
      code: `{
        "name": "p1",
        "dependencies": {
          "package": "workspace: *"
        }
      }`,
      filename: "package.json",
      errors: [
        {
          messageId: "invalidVersionDetected",
          data: {
            package: "package",
            reason: "space detected after worksapce protocol",
          },
        },
      ],
    },
    // invalid workspace dependency (format)
    {
      code: `{
        "name": "p1",
        "dependencies": {
          "package": "workspace:~~"
        }
      }`,
      filename: "package.json",
      errors: [
        {
          messageId: "invalidVersionDetected",
          data: {
            package: "package",
            reason: "invalid version format",
          },
        },
      ],
    },
    // dist tag does not exist
    {
      code: `{
        "name": "p1",
        "dependencies": {
          "lodash": "latest2"
        }
      }`,
      filename: "package.json",
      errors: [
        {
          messageId: "invalidVersionDetected",
          data: {
            package: "lodash",
            reason: "dist tag does not exist",
          },
        },
      ],
    },
    // invalid dependency format
    {
      code: `{
        "name": "p1",
        "dependencies": {
          "package": "~~"
        }
      }`,
      filename: "package.json",
      errors: [
        {
          messageId: "invalidVersionDetected",
          data: {
            package: "package",
            reason: "invalid version format",
          },
        },
      ],
    },
  ],
});
