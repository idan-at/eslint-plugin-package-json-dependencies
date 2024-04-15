# valid-versions

Ensures that the used dependencies versions are valid.

\***\*Bad\*\***: (invalid format)

```json
{
  "dependencies": {
    "foo": "~~1.0.0"
  }
}
```

\***\*Good\*\***:

```json
{
  "dependencies": {
    "foo": "~1.0.0"
  }
}
```

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

\***\*Bad\*\***: (dist-tag does not exist)

```json
{
  "dependencies": {
    "foo": "badDistTag"
  }
}
```

\***\*Good\*\***:

```json
{
  "dependencies": {
    "foo": "latest"
  }
}
```
