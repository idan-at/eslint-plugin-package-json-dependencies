import path from "path";

const FIXTURES_ROOT_PATH = path.resolve("./__tests__/fixtures");
const NO_MISSING_TYPES_FIXTURE_PATH = path.join(
  FIXTURES_ROOT_PATH,
  "no-missing-types"
);
const ALPHABETICALLY_SORTED_DEPENDENCIES_FIXTURES_PATH = path.join(
  FIXTURES_ROOT_PATH,
  "alphabetically-sorted-dependencies"
);

export {
  FIXTURES_ROOT_PATH,
  NO_MISSING_TYPES_FIXTURE_PATH,
  ALPHABETICALLY_SORTED_DEPENDENCIES_FIXTURES_PATH,
};
