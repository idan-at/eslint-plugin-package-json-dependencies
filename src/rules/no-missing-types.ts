import {
  isPackageJsonFile,
  isValidPackageJsonAST,
  extractPropertyObjectExpression,
} from "./utils";
import { Rule } from "eslint";
import { groupBy } from "lodash";

interface RuleOptions {
  exclude: string[];
}

const hasTypesDependency = (
  dependency: string,
  typesDependencies: string[]
): boolean => {
  if (dependency.startsWith("@")) {
    return typesDependencies.includes(`@types/${dependency.replace("@", "").replace("/", "__")}`)
  } else {
    return typesDependencies.includes(`@types/${dependency}`);
  }
};

const hasTypes = (
  dependency: string,
  typesDependencies: string[]
): boolean => hasTypesDependency(dependency, typesDependencies);

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    messages: {
      "invalidJson": "Package JSON is not a valid JSON file",
      "missingTypes": "Missing types for {{ package }}",
    },
    docs: {
      description: "detect missing @types dependencies",
      category: "Possible Errors",
      recommended: true,
      url: "", // TODO
    },
    schema: [
      {
        type: "object",
        properties: {
          exclude: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create: function (context: Rule.RuleContext): Rule.RuleListener {
    return {
      "Program:exit": (node: Rule.Node) => {
        const filePath = context.getFilename();

        if (!isPackageJsonFile(filePath)) {
          return;
        }

        if (!isValidPackageJsonAST(node)) {
          context.report({
            node,
            messageId: "invalidJson",
          });

          return;
        }

        const options: unknown = context.options;
        const { exclude = [] } = options as RuleOptions;

        // @ts-ignore
        const packageJsonAST = node.body[0].expression;

        const dependencies = [
          ...extractPropertyObjectExpression(packageJsonAST, "devDependencies"),
          ...extractPropertyObjectExpression(packageJsonAST, "dependencies"),
        ];

        const { true: typesDependencies = [], false: codeDependencies = [] } =
          groupBy(dependencies, (dependency) =>
            dependency.startsWith("@types/")
          );

        for (const dependency of codeDependencies.filter(dependency => exclude.includes(dependency))) {
          if (!hasTypes(dependency, typesDependencies)) {
            context.report({
              node,
              messageId: "missingTypes",
              data: {
                package: dependency
              }
            })
          }
        }
      },
    };
  },
};

export { rule };
