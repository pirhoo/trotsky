import { Step, type StepStream } from "../trotsky"

/**
 * @experimental
 * 
 * Represents an individual entry step within a {@link StepStream}.
 * 
 * @typeParam P - The parent type of this step, defaulting to {@link StepStream}.
 * @typeParam C - The context type, defaulting to `unknown`.
 * @typeParam O - The output type, defaulting to `unknown`.
 * @public
 */
export class StepStreamEntry<P = StepStream, C = unknown, O = unknown> extends Step<P, C, O> { 

  /**
   * Applies the logic for the step. This base implementation sets the output to `null`.
   * 
   * @override
   * @returns A promise that resolves when the step is applied.
   */
  async apply (): Promise<void> {
    this.output = null
  }
}
