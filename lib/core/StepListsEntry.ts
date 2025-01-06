import { ListMixins, type StepLists, type StepListsOutput } from "../trotsky"

/**
 * Represents an individual entry step within a {@link StepLists} list.
 * 
 * @typeParam P - The parent type of this step, defaulting to {@link StepLists}.
 * @typeParam C - The context type, defaulting to {@link StepListsOutput}.
 * @typeParam O - The output type, defaulting to `null`.
 * @public
 */
export class StepListsEntry<P = StepLists, C extends StepListsOutput = StepListsOutput, O = null> extends ListMixins<P, C, O> {

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
