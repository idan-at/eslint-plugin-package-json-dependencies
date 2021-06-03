import { Dictionary } from "lodash";

interface Dependencies extends Dictionary<string> {
  [index: string]: string;
}

type DependencyGranularity = "fixed" | "patch" | "minor";

export { Dependencies, DependencyGranularity };
