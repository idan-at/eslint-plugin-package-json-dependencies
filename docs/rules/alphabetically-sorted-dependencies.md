# alphabetically-sorted-dependencies

Makes sure every dependencies object (`dependencies` / `devDependencies` / `peerDependencies` / `optionalDependencies`) is alphabetically sorted.

**NOTE**: This rule will alphabetically order your dependencies, if the `--fix` flag is passed to ESLint.

__**Bad**__:

```json
{
  "dependencies": {
    "lodash": "~4.17.0",
    "axios": "~0.21.0"
  }
}

````

__**Good**__:

```json
{
  "dependencies": {
    "axios": "~0.21.0",
    "lodash": "~4.17.0"
  }
}

````
