import { Step, type StepStream } from "../trotsky"

export class StepStreamEntry<P = StepStream, C = unknown, O = unknown> extends Step<P, C, O> { 
  apply (): never {
    throw new Error("Apply method not implemented.")
  }
}