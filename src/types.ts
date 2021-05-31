import { Dictionary } from "lodash";

interface Dependencies extends Dictionary<string> {
  [index: string]: string
}

export { Dependencies }
