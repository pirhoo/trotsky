import type { StepActors } from "../trotsky"
import { ActorMixins } from "./mixins/ActorMixins"

/**
 * Represents a single entry step for processing actor information.
 * Extends {@link ActorMixins} to provide common actor-related methods.
 * 
 * @typeParam P - The parent type of this step, defaulting to StepActors.
 * @typeParam C - The child type for this step, defaulting to null.
 * @typeParam O - The output type, defaulting to null.
 */
export class StepActorsEntry<P = StepActors, C = null, O = null> extends ActorMixins<P, C, O> { 
  
  /**
   * Applies the step's logic. In this implementation, sets the output to null.
   * @override
   */
  async apply (): Promise<void> {
    this.output = null
  }
}
