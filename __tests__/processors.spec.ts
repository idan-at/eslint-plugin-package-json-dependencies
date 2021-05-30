import { processors } from "../src/processors"
import { Chance } from "chance";
import { Linter } from "eslint";
import { mock } from "jest-mock-extended";

const chance = new Chance();

describe("processors", () => {
  describe(".json", () => {
    const processor = processors[".json"];

    test("preprocess", () => {
      const source = chance.word();

      expect(processor.preprocess(source, "package.json")).toStrictEqual([`(${source})`]);
      expect(processor.preprocess(source, "not-package.json")).toStrictEqual([source]);
    });

    test("postprocess", () => {
      const error = mock<Linter.LintMessage>();

      expect(processor.postprocess([[error]])).toStrictEqual([error]);
    })
  })
})
