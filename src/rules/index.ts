import { rule as noMissingTypes } from "./no-missing-types";
import { rule as alphabeticallySortedDependencies } from "./alphabetically-sorted-dependencies";
import { rule as controlledVersions } from "./controlled-versions";
import { rule as betterAlternative } from "./better-alternative";
import { rule as validVersions } from "./valid-versions";

const rules = {
  "no-missing-types": noMissingTypes,
  "alphabetically-sorted-dependencies": alphabeticallySortedDependencies,
  "controlled-versions": controlledVersions,
  "better-alternative": betterAlternative,
  "valid-versions": validVersions,
};

export { rules };
