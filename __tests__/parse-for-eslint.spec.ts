import { parseForESLint } from "..";
import dedent from "dedent";

describe("parseForESLint", () => {
  test("throws with the correct position for invalid JSON", () => {
    expect(() => parseForESLint("{},")).toThrow(/Unexpected token , in JSON at position 2/)
  })

  test("returns a correct AST for valid JSON", () => {
    const { ast } = parseForESLint(dedent`{
      "foo": "bar",
      "baz": 42
    }`)

    expect(ast.body).toHaveLength(1);
  })
})
