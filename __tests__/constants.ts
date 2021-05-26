import path from "path";

const FIXTURES_ROOT_PATH = path.resolve("./__tests__/fixtures");
const MISSING_TYPES_FIXTURE_PATH = path.join(
  FIXTURES_ROOT_PATH,
  "missing-types"
);

export { FIXTURES_ROOT_PATH, MISSING_TYPES_FIXTURE_PATH };
