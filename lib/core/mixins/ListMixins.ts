import { Step, StepListMembers } from "../../trotsky"

/**
 * A mixin class providing reusable list-related methods to extend step functionality.
 * These methods append specific list-related steps to the current chain.
 * 
 * @typeParam P - The parent step type.
 * @typeParam C - The context type.
 * @typeParam O - The output type.
 * 
 * @public
 */
export abstract class ListMixins<P, C, O> extends Step<P, C, O> {
  
  /**
   * Appends a step to fetch the members of the current list.
   * 
   * @returns The appended {@link StepListMembers} instance.
   */
  members () {
    return this.append(StepListMembers<this>)
  }
}
