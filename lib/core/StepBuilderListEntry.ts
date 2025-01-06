import type { StepBuilderList } from "../trotsky"
import { Step } from "../trotsky"

/**
 * Represents an individual entry step within a {@link StepBuilderList}.
 * 
 * @typeParam P - The parent type of this step, defaulting to {@link StepBuilderList}.
 * @typeParam C - The child context type, defaulting to `unknown`.
 * @typeParam O - The output type, defaulting to `unknown`.
 * @public
 */
export class StepBuilderListEntry<P = StepBuilderList, C = unknown, O = unknown> extends Step<P, C, O> { 

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
