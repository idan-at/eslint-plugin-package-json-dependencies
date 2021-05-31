# eslint-plugin-package-json-dependencies

[![npm version](https://badge.fury.io/js/eslint-plugin-package-json-dependencies.svg)](https://badge.fury.io/js/eslint-plugin-package-json-dependencies)
[![Actions Status: build](https://github.com/idan-at/eslint-plugin-package-json-dependencies/workflows/test/badge.svg)](https://github.com/idan-at/eslint-plugin-package-json-dependencies/actions?query=workflow%3A"test")


This plugin contains rules for maintaining a valid, consistent `package.json` dependency setup.

# Installation

```bash
npm install --save-dev eslint eslint-plugin-package-json-dependencies
```

# Usage

1. Add the plugin and its parser to your eslint [config file](https://eslint.org/docs/user-guide/configuring/configuration-files) `overrides` section:
```js
// eslintrc.json
{
  "overrides": [
    {
      "files": ["*.json"],
      "parser": "eslint-plugin-package-json-dependencies",
      "plugins": ["package-json-dependencies"]
    }
  ]
}
```

2. Apply the specific rules applicable to your repo, e.g.:
```js
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
- [better-alternative](https://github.com/idan-at/eslint-plugin-package-json-dependencies/blob/master/docs/rules/better-alternative.md)
