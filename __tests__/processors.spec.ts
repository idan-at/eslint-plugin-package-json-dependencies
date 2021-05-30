import { processors } from "../src/processors";
import { Chance } from "chance";
import { Linter } from "eslint";
import { mock } from "jest-mock-extended";

const chance = new Chance();

describe("processors", () => {
  describe(".json", () => {
    const processor = processors[".json"];

    test("preprocess", () => {
      const source = chance.word();

      expect(processor.preprocess(source)).toStrictEqual([`(${source})`]);
    });

    test("postprocess", () => {
      const error = mock<Linter.LintMessage>({
        fix: { range: [10, 20] },
      });

      const processed = processor.postprocess([[error]]);

      expect(processed).toHaveLength(1);
      expect(processed[0]).toHaveProperty("fix.range", [9, 19]);
    });
  });
});
