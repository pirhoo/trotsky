import { Step, type StepBuilderStream } from "../trotsky"

/**
 * @experimental
 * 
 * Represents an individual entry step within a {@link StepBuilderStream}.
 * 
 * @typeParam P - The parent type of this step, defaulting to {@link StepBuilderStream}.
 * @typeParam C - The context type, defaulting to `unknown`.
 * @typeParam O - The output type, defaulting to `unknown`.
 * @public
 */
export class StepBuilderStreamEntry<P = StepBuilderStream, C = unknown, O = unknown> extends Step<P, C, O> { 

  /**
   * Applies the step's logic but do nothing by default. This method is 
   * usually be overridden by child classes but will not throw an error if not.
   * @override
   */
  async apply (): Promise<void> { }
}
