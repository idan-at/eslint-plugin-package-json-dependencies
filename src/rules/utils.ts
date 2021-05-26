import path from "path";
import { Rule } from "eslint";
import { ObjectExpression } from "estree";

const isPackageJsonFile = (filePath: string): boolean =>
  path.basename(filePath) === "package.json";

const isValidJsonAST = (node: Rule.Node): boolean =>
  node.type === "Program" &&
  node.body.length === 1 &&
  node.body[0].type === "ExpressionStatement" &&
  node.body[0].expression.type === "ObjectExpression";

const extractPropertyObjectExpression = (
  node: ObjectExpression,
  propertyName: string
): string[] => {
  const property = node.properties.find(
    (property) =>
      property.type === "Property" &&
      property.key.type === "Literal" &&
      property.key.value === propertyName
  );

  if (
    !property ||
    property.type !== "Property" ||
    property.value.type !== "ObjectExpression"
  ) {
    return [];
  }

  return property.value.properties.reduce<string[]>((acc, property) => {
    if (
      property.type === "Property" &&
      property.key.type === "Literal" &&
      typeof property.key.value === "string"
    ) {
      acc.push(property.key.value);
    }

    return acc;
  }, []);
};

export {
  isPackageJsonFile,
  isValidJsonAST,
  extractPropertyObjectExpression,
};
