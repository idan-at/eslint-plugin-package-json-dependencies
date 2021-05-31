import { parseScript } from "esprima";
import { Linter, AST } from "eslint";

// We parse the JSON as JS, but since non of the rules use the AST, we don't fix the locations.
function parseForESLint(text: string, options?: any): Linter.ESLintParseResult {
  const code = `(${text});`;

  try {
    const ast = parseScript(code, options) as AST.Program;

    return { ast };
  } catch (error) {
    try {
      JSON.parse(text);
    } catch (parseError) {
      error.message = parseError.message;
    }

    throw error;
  }
}

export { parseForESLint };
