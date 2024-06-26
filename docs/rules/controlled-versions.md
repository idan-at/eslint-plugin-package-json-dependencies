# controlled-versions

Makes sure any used package is set to a controlled version. A controlled version is a semver that follows the passed granularity restrictions.

Supported granularity:

- `fixed`: All packages versions should be fixed (e.g `1.0.0`).
- `patch`: All packages versions should start with `~` (e.g `~1.0.0`), or follow the restrictions for `fixed`.
- `minor`: All packages versions should start with `^` (e.g `^1.0.0`) or follow the restrictions for `patch`.

Examples for assuming `patch` is set:

\***\*Bad\*\***:

```json
{
  "dependencies": {
    "lodash": "^4.17.0"
  }
}
```

\***\*Good\*\***:

```json
{
  "dependencies": {
    "lodash": "~4.17.0"
  }
}
```

\***\*Also Good\*\***:

```json
{
  "dependencies": {
    "lodash": "4.17.0"
  }
}
```

NOTE: This rule will update your dependencies' versions, if the --fix flag is passed to ESLint.

## Options

- `granularity`: Either a string: `fixed` / `patch` / `minor`, as mentioned above, or an object where the key is the dependencies key (`dependencies`, `devDependencies`, `peerDependencies`, `optionalDependencies`) and the value is one of the values above. If not provided, defaults to `fixed`.
- `excludePatterns: string[]`: Makes this rule ignore packages that match the given patterns and do not fail. Might be useful for specific packages that are used with dist-tags.
