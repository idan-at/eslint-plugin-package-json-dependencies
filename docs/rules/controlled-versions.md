# controlled-versions

Makes sure any used package is set to a controlled version. A controlled version is a semver that follows the passed granularity restrictions.

Supported granularity:
- `fixed`: All packages versions should be fixed (e.g `1.0.0`).
- `patch`: All packages versions should start with `~` (e.g `~1.0.0`), or follow the restrictions for `fixed`.
- `minor`: All packages versions should start with `^` (e.g `^1.0.0`) or follow the restrictions for `patch`.

Examples for assuming `patch` is set:

__**Bad**__:

```json
{
  "dependencies": {
    "lodash": "^4.17.0"
  }
}

````

__**Good**__:

```json
{
  "dependencies": {
    "lodash": "~4.17.0"
  }
}

````

__**Also Good**__:

```json
{
  "dependencies": {
    "lodash": "4.17.0"
  }
}

````

## Options
- `granularity`: `fixed` / `patch` / `minor`, as mentioned above. If not provided, defaults to `fixed`.
- `excludePatterns: string[]`: Makes this rule ignore packages that match the given patterns and do not fail. Might be useful for specific packages that are used with dist-tags.
