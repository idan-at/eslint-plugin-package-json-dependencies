# better-alternative

Provides a way to ensure that the used dependencies are the preferred ones.

Assuming the rule is used with the following options:
```json
{
  "alternatives": {
    "node-fetch": "axios"
  }
}

```

__**Bad**__:

```json
{
  "dependencies": {
    "node-fetch": "~2.6.0"
  }
}

````


__**Good**__:

```json
{
  "dependencies": {
    "axios": "~0.21.0"
  }
}

````

## Options
- `alternatives: Record<string, string>`: An object containing the to-be replaced packages as keys, and their alternative packages as values.
