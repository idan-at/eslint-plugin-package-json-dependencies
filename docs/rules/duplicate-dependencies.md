# duplicate-dependencies

Asserts dependencies are only defined once.

\***\*Bad\*\***:

```json
{
  "dependencies": {
    "lodash": "^4.17.0"
  },
  "devDependencies": {
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

\***\*Also Good\*\***: (depends on the use case)

```json
{
  "devDependencies": {
    "lodash": "4.17.0"
  }
}
```

## Options

- `exclude: string[]`: A list of dependencies this rule will ignore.
