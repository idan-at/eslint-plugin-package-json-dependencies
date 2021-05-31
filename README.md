# eslint-plugin-package-json-dependencies

[![npm version](https://badge.fury.io/js/eslint-plugin-package-json-dependencies.svg)](https://badge.fury.io/js/eslint-plugin-package-json-dependencies)
[![Actions Status: build](https://github.com/idan-at/eslint-plugin-package-json-dependencies/workflows/test/badge.svg)](https://github.com/idan-at/eslint-plugin-package-json-dependencies/actions?query=workflow%3A"test")


This plugin contains rules for valid and consistent package json dependencies.

# Install
Make sure `eslint` is installed.

Then,

`npm install --save-dev eslint-plugin-package-json-dependencies`

# Usage
First, add the plugin and its parser to your eslint config `overrides` section:
```json
// eslintrc.json
{
  "overrides": [
    {
      "files": ["*.json"],
      "parser": "eslint-plugin-package-json-dependencies",
      "plugins": ["package-json-dependencies"],
    }
  ]
}
```

Then, apply the specific rules you want:
```json
// eslintrc.json
{
  "rules": {
    "package-json-dependencies/no-missing-types": "error"
  }
}
```

# Available Rules

- [no-missing-types](https://github.com/idan-at/eslint-plugin-package-json-dependencies/blob/master/docs/rules/no-missing-types.md)
- [alphabetically-sorted-dependencies](https://github.com/idan-at/eslint-plugin-package-json-dependencies/blob/master/docs/rules/alphabetically-sorted-dependencies.md)
- [controlled-versions](https://github.com/idan-at/eslint-plugin-package-json-dependencies/blob/master/docs/rules/controlled-versions.md)
