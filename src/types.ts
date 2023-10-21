import { Dictionary } from "lodash";

interface Dependencies extends Dictionary<string> {
  [index: string]: string;
}

type DependencyGranularity = "fixed" | "patch" | "minor";

type GranularityOption = DependencyGranularity | {
  dependencies?: DependencyGranularity
  devDependencies?: DependencyGranularity
  peerDependencies?: DependencyGranularity
  optionalDependencies?: DependencyGranularity
}

export { Dependencies, DependencyGranularity, GranularityOption };
