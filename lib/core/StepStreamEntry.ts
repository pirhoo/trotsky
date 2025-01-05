import { Step, type StepStream } from "../trotsky"

export class StepStreamEntry<P = StepStream, C = unknown, O = unknown> extends Step<P, C, O> { 
  async apply (): Promise<void> {
    this.output = null
  }
}