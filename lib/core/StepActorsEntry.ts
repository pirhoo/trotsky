import type { StepActors } from "../trotsky"
import { ActorMixins } from "./mixins/ActorMixins"

/**
 * Represents a single entry step for processing actor information.
 * Extends {@link ActorMixins} to provide common actor-related methods.
 * 
 * @typeParam P - The parent type of this step, defaulting to {@link StepActors}.
 * @typeParam C - The child type for this step, defaulting to `unknown`.
 * @typeParam O - The output type, defaulting to `unknown`.
 */
export class StepActorsEntry<P = StepActors, C = unknown, O = unknown> extends ActorMixins<P, C, O> { 
  
  /**
   * Applies the step's logic but do nothing by default. This method is 
   * usually be overridden by child classes but will not throw an error if not.
   * @override
   */
  async apply (): Promise<void> { }
}
