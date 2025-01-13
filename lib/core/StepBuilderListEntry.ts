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
   * Applies the step's logic but do nothing by default. This method is 
   * usually be overridden by child classes but will not throw an error if not.
   * @override
   */
  async apply (): Promise<void> { }
}
