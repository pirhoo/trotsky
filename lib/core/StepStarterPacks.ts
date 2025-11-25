import type { AtUri, AtpAgent, AppBskyGraphGetStarterPacks, AppBskyGraphDefs } from "@atproto/api"

import { StepBuilderList, StepBuilderListIterator, StepStarterPacksEntry, type StepBuilder } from "../trotsky"
import { Resolvable, resolveValue } from "./utils/resolvable"

/**
 * Type for the parameter passed to the {@link StepStarterPacks} class.
 * Represents the URIs of several starter packs.
 * @public
 */
export type StepStarterPacksUris = (string | AtUri)[]

/**
 * Defines the query parameters for retrieving multiple starter packs.
 * @public
 */
export type StepStarterPacksQueryParams = AppBskyGraphGetStarterPacks.QueryParams

/**
 * Represents the output of a starter packs step, consisting of an array of starter pack views.
 * @public
 */
export type StepStarterPacksOutput = AppBskyGraphDefs.StarterPackViewBasic[]

/**
 * Abstract class representing a list of starter packs to process.
 *
 * @typeParam P - The parent type of this step, defaulting to {@link StepBuilder}.
 * @typeParam C - The child context type, defaulting to `null`.
 * @typeParam O - The output type, defaulting to {@link StepStarterPacksOutput}.
 *
 * @example
 * Get multiple starter packs by their URIs:
 * ```ts
 * const packUris = [
 *   "at://did:plc:example1/app.bsky.graph.starterpack/pack1",
 *   "at://did:plc:example2/app.bsky.graph.starterpack/pack2"
 * ]
 *
 * await Trotsky.init(agent)
 *   .starterPacks(packUris)
 *   .tap((step) => {
 *     step.context.forEach(pack => {
 *       console.log(`${pack.creator.handle}: ${pack.listItemCount} members`)
 *     })
 *   })
 *   .run()
 * ```
 *
 * @example
 * Iterate through multiple starter packs:
 * ```ts
 * await Trotsky.init(agent)
 *   .starterPacks([uri1, uri2, uri3])
 *   .each()
 *   .tap((step) => {
 *     const pack = step.context
 *     console.log(`Pack by @${pack.creator.handle}`)
 *     console.log(`Joined: ${pack.joinedAllTimeCount || 0}`)
 *   })
 *   .run()
 * ```
 *
 * @public
 */
export class StepStarterPacks<P = StepBuilder, C = null, O extends StepStarterPacksOutput = StepStarterPacksOutput> extends StepBuilderList<P, C, O> {

  /**
   * Holds the list of steps to be executed for each starter pack entry.
   */
  _steps: StepStarterPacksEntry<this>[] = []

  /**
   * The URIs of the starter packs to retrieve, which can be resolved dynamically at runtime.
   */
  _uris: Resolvable<StepStarterPacksUris>

  /**
   * Initializes the StepStarterPacks instance with the given agent, parent, and URIs.
   *
   * @param agent - The AT protocol agent used for API calls.
   * @param parent - The parent step in the chain.
   * @param uris - The URIs of the starter packs to retrieve, possibly resolvable at runtime.
   */
  constructor (agent: AtpAgent, parent: P, uris: Resolvable<StepStarterPacksUris> = []) {
    super(agent, parent)
    this._uris = uris
  }

  /**
   * Clones the current step and returns a new instance with the same parameters.
   * @param rest - Additional parameters to pass to the cloned step. This is useful for child class overriding the clone.
   * @returns A new {@link StepStarterPacks} instance.
   */
  override clone (...rest: unknown[]) {
    return super.clone(this._uris, ...rest)
  }

  /**
   * Appends a new starter pack entry step to the current list and returns it.
   *
   * @param iterator - Optional iterator function to be executed for each item in the list.
   * @returns The newly appended {@link StepStarterPacksEntry} instance.
   */
  each (iterator?: StepBuilderListIterator): StepStarterPacksEntry<this> {
    return this.withIterator(iterator).append(StepStarterPacksEntry<this>)
  }

  /**
   * Applies the step by resolving the URIs parameter and fetching the starter packs.
   * Sets the starter packs data as the output of this step.
   * @returns A promise that resolves when the step is complete.
   */
  async applyPagination (): Promise<void> {
    const uris = (await resolveValue<StepStarterPacksUris>(this, this._uris)).map(uri => uri.toString())

    // If no URIs provided, return empty array
    if (uris.length === 0) {
      this.output = [] as O
      return
    }

    const { data } = await this.agent.app.bsky.graph.getStarterPacks({ uris })
    this.output = data.starterPacks as O
  }
}
