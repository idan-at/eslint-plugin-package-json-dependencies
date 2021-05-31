import { rule as noMissingTypes } from "./no-missing-types";
import { rule as alphabeticallySortedDependencies } from "./alphabetically-sorted-dependencies";
import { rule as controlledVersions } from "./controlled-versions";

const rules = {
  "no-missing-types": noMissingTypes,
  "alphabetically-sorted-dependencies": alphabeticallySortedDependencies,
  "controlled-versions": controlledVersions,
};

export { rules };
