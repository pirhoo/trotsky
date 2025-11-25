import type { StepStarterPacks, StepStarterPacksOutput } from "../trotsky"
import { StepBuilderListEntry } from "./StepBuilderListEntry"

/**
 * Represents an individual entry step within a {@link StepStarterPacks} list.
 * Provides context for each starter pack in the iteration.
 *
 * @typeParam P - The parent type of this step, defaulting to {@link StepStarterPacks}.
 * @typeParam C - The context type, defaulting to an element of {@link StepStarterPacksOutput}.
 * @typeParam O - The output type, defaulting to `unknown`.
 *
 * @example
 * Iterate through starter packs and log details:
 * ```ts
 * await Trotsky.init(agent)
 *   .starterPacks([uri1, uri2])
 *   .each()
 *   .tap((step) => {
 *     console.log(`Creator: @${step.context.creator.handle}`)
 *     console.log(`Members: ${step.context.listItemCount}`)
 *   })
 *   .run()
 * ```
 *
 * @example
 * Filter starter packs by join count:
 * ```ts
 * await Trotsky.init(agent)
 *   .starterPacks(packUris)
 *   .each()
 *   .when((step) => (step.context.joinedAllTimeCount || 0) > 100)
 *   .tap((step) => {
 *     console.log(`Popular pack: ${step.context.uri}`)
 *   })
 *   .run()
 * ```
 *
 * @public
 */
export class StepStarterPacksEntry<
  P = StepStarterPacks,
  C = StepStarterPacksOutput[number],
  O = unknown
> extends StepBuilderListEntry<P, C, O> {

  /**
   * Applies the step's logic but does nothing by default. This method is
   * usually overridden by child classes but will not throw an error if not.
   * @override
   */
  async apply (): Promise<void> { }
}
