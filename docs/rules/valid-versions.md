# valid-versions

Ensures that the used dependencies versions are valid.

\***\*Bad\*\***: (notice the space before the asterisk)

```json
{
  "dependencies": {
    "foo": "workspace: *"
  }
}
```

\***\*Good\*\***:

```json
{
  "dependencies": {
    "foo": "workspace:*"
  }
}
```
