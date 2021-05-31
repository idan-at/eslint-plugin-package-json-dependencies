# no-missing-types

Ensures that any pacakges used has Typescript definitions (either included in the package itself, or installed as a separate `@types`-scoped dependency)

**NOTE**: Packages containing their own types do not require any supporting `@types`-scoped packages to be installed (e.g., `axios`).

__**Bad**__: 

`lodash` is used without installing `@types/lodash`:

```json
{
  "dependencies": {
    "lodash": "~4.17.0"
  }
}

````

__**Good**__: 

`@types/lodash` is included as dev-depdendency, providing types for the `lodash` package:

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

## Options
- `excludePatterns: string[]`: Tells this rule to ignore packages matching the given patterns. Might be useful for a custom `jest`-reporter or an `ESLint` plugin that doesn't have any types exposed.
