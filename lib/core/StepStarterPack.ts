import type { AtUri, AtpAgent, AppBskyGraphGetStarterPack, AppBskyGraphDefs } from "@atproto/api"

import { Step, type StepBuilder } from "../trotsky"
import type { Resolvable } from "./utils/resolvable"
import { resolveValue } from "./utils/resolvable"

/**
 * Defines the query parameters for retrieving a starter pack.
 * @public
 */
export type StepStarterPackQueryParams = AppBskyGraphGetStarterPack.QueryParams

/**
 * Represents a starter pack's URI, which can be a string or an {@link AtUri}.
 * @public
 */
export type StepStarterPackUri = string | AtUri

/**
 * Represents the output of a retrieved starter pack, including its URI, CID, record data, creator, and associated lists/feeds.
 * @public
 */
export type StepStarterPackOutput = AppBskyGraphDefs.StarterPackView

/**
 * Represents a step for retrieving a starter pack by its URI.
 *
 * @typeParam P - The parent type of this step, defaulting to {@link StepBuilder}.
 * @typeParam C - The child context type, defaulting to `null`.
 * @typeParam O - The output type, defaulting to {@link StepStarterPackOutput}.
 *
 * @example
 * Get a specific starter pack:
 * ```ts
 * await Trotsky.init(agent)
 *   .starterPack("at://did:plc:example/app.bsky.graph.starterpack/packid")
 *   .tap((step) => {
 *     console.log(`Creator: ${step.context.creator.handle}`)
 *     console.log(`List: ${step.context.list?.name}`)
 *     console.log(`Joined this week: ${step.context.joinedWeekCount}`)
 *   })
 *   .run()
 * ```
 *
 * @example
 * Get starter pack details and display feeds:
 * ```ts
 * await Trotsky.init(agent)
 *   .starterPack("at://did:plc:example/app.bsky.graph.starterpack/packid")
 *   .tap((step) => {
 *     console.log(`Feeds in pack: ${step.context.feeds?.length || 0}`)
 *     step.context.feeds?.forEach(feed => {
 *       console.log(`- ${feed.displayName}`)
 *     })
 *   })
 *   .run()
 * ```
 *
 * @public
 */
export class StepStarterPack<P = StepBuilder, C = null, O extends StepStarterPackOutput = StepStarterPackOutput> extends Step<P, C, O> {

  /**
   * The URI of the starter pack to retrieve, which can be resolved dynamically at runtime.
   * @internal
   */
  _uri: Resolvable<StepStarterPackUri>

  /**
   * Initializes the StepStarterPack instance with the given agent, parent, and URI.
   *
   * @param agent - The AT protocol agent used for API calls.
   * @param parent - The parent step in the chain.
   * @param uri - The URI of the starter pack to retrieve, possibly resolvable at runtime.
   */
  constructor (agent: AtpAgent, parent: P, uri: Resolvable<StepStarterPackUri>) {
    super(agent, parent)
    this._uri = uri
  }

  /**
   * Clones the current step and returns a new instance with the same parameters.
   * @param rest - Additional parameters to pass to the cloned step. This is useful for child class overriding the clone.
   * @returns A new {@link StepStarterPack} instance.
   */
  override clone (...rest: unknown[]) {
    return super.clone(this._uri, ...rest)
  }

  /**
   * Applies the step logic to retrieve the starter pack and sets the output to the retrieved starter pack's data.
   * If no starter pack is found, the output is set to `null`.
   *
   * @override
   */
  async apply () {
    const { "data": { starterPack } } = await this.agent.app.bsky.graph.getStarterPack(await this.queryParams())
    this.output = starterPack as O ?? null
  }

  /**
   * Resolves the query parameters for retrieving the starter pack, including its URI.
   *
   * @returns A promise that resolves to the query parameters.
   */
  async queryParams (): Promise<StepStarterPackQueryParams> {
    const uri = await resolveValue<StepStarterPackUri>(this, this._uri)
    const starterPack = uri.toString?.() ?? uri.toString()
    return { starterPack }
  }
}
