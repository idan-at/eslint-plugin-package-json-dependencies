# eslint-plugin-package-json-dependencies

[![npm version](https://badge.fury.io/js/eslint-plugin-package-json-dependencies.svg)](https://badge.fury.io/js/eslint-plugin-package-json-dependencies)
[![Actions Status: build](https://github.com/idan-at/eslint-plugin-package-json-dependencies/workflows/test/badge.svg)](https://github.com/idan-at/eslint-plugin-package-json-dependencies/actions?query=workflow%3A"test")


This plugin contains rules for valid and consistent package json dependencies.

# Install
Make sure `eslint` is installed.

Then,

`npm install --save-dev eslint-plugin-package-json-dependencies`

# Usage
First, add the plugin to your eslint config:
```json
// eslintrc.json
{
  "plugins": ["package-json-dependencies"]
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

# More information

More details can be found under the [docs](https://github.com/idan-at/eslint-plugin-package-json-dependencies/tree/master/docs) folder, for each rule.
