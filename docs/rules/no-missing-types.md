# no-missing-types

Makes sure any used package has typescript definitions, whether it's packed within the package or installed as a separate @types package.

__**Bad**__: (`lodash` is used without installing its types)

```json
{
  "dependencies": {
    "lodash": "~4.17.0"
  }
}

````

__**Good**__: (`@types/lodash` is installed for `lodash`)

```json
{
  "dependencies": {
    "lodash": "~4.17.0"
  },
  "devDependencies": {
    "@types/lodash": "~4.14.0"
  }
}

````


**NOTE**: If a package that contains its own types is installed, nothing else needs to be installed. (for example, `axios`)

## Options
- `excludePatterns: string[]`: Makes this rule ignore packages that match the given patterns and do not fail. Might be useful for a custom jest-reporter or an ESLint plugin that do not have types.
