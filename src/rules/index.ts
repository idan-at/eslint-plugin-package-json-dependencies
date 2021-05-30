import { rule as noMissingTypes } from "./no-missing-types";
import { rule as alphabeticallySortedDependencies } from "./alphabetically-sorted-dependencies";

const rules = {
  "no-missing-types": noMissingTypes,
  "alphabetically-sorted-dependencies": alphabeticallySortedDependencies,
};

export { rules };
