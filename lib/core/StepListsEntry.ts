import { ListMixins, type StepLists, type StepListsOutput } from "../trotsky"

/**
 * Represents an individual entry step within a {@link StepLists} list.
 * 
 * @typeParam P - The parent type of this step, defaulting to {@link StepLists}.
 * @typeParam C - The context type, defaulting to {@link StepListsOutput}.
 * @typeParam O - The output type, defaulting to `unknown`.
 * @public
 */
export class StepListsEntry<P = StepLists, C extends StepListsOutput = StepListsOutput, O = unknown> extends ListMixins<P, C, O> {

  /**
   * Applies the step's logic but do nothing by default. This method is 
   * usually be overridden by child classes but will not throw an error if not.
   * @override
   */
  async apply (): Promise<void> { }
}
