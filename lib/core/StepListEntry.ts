import type { StepList } from "../trotsky"
import { Step } from "../trotsky"


export class StepListEntry<P = StepList, C = unknown, O = unknown> extends Step<P, C, O> { 
  apply (): never {
    throw new Error("Apply method not implemented.")
  }
}
