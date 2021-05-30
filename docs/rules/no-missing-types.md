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
Sometimes you want to allow certain packages to be installed without having types, a custom jest-reporter or an ESLint plugin are great examples. In this case, use the `excludePatterns: string[]` option to make this rule ignore those packages and do not fail.
