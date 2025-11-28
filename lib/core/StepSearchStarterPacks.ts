import type { AppBskyGraphSearchStarterPacks, AtpAgent } from "@atproto/api"

import { StepStarterPacks } from "../trotsky"

/**
 * Represents the output of a search starter packs step, consisting of an array of starter packs.
 * @public
 */
export type StepSearchStarterPacksOutput = AppBskyGraphSearchStarterPacks.OutputSchema["starterPacks"]

/**
 * Represents the query parameters for searching starter packs.
 * @public
 */
export type StepSearchStarterPacksQueryParams = AppBskyGraphSearchStarterPacks.QueryParams

/**
 * Represents the cursor for paginating through search starter pack results.
 * @public
 */
export type StepSearchStarterPacksQueryParamsCursor = StepSearchStarterPacksQueryParams["cursor"] | undefined

/**
 * Represents a step for searching starter packs on Bluesky, with support for pagination.
 *
 * @remarks
 * Note: The `searchStarterPacks` API endpoint may not be available on all Bluesky servers.
 * As of November 2025, this API is available in test environments but not yet deployed to
 * the main Bluesky network. When the API is not available, it will throw an XRPCNotSupported error.
 *
 * @typeParam P - The parent type of this step.
 * @typeParam C - The child context type, defaulting to `null`.
 * @typeParam O - The output type, defaulting to {@link StepSearchStarterPacksOutput}.
 *
 * @example
 * Search for starter packs and display them:
 * ```ts
 * await Trotsky.init(agent)
 *   .searchStarterPacks({ q: "typescript" })
 *   .take(10)
 *   .each()
 *   .tap((step) => {
 *     console.log(`Pack URI: ${step.context.uri}`)
 *     console.log(`Creator: @${step.context.creator.handle}`)
 *     console.log(`Members: ${step.context.listItemCount || 0}`)
 *   })
 *   .run()
 * ```
 *
 * @example
 * Filter starter packs by join count:
 * ```ts
 * await Trotsky.init(agent)
 *   .searchStarterPacks({ q: "tech" })
 *   .take(20)
 *   .each()
 *   .when((step) => (step?.context?.joinedAllTimeCount || 0) > 100)
 *   .tap((step) => {
 *     console.log(`Popular pack: ${step.context.uri}`)
 *   })
 *   .run()
 * ```
 *
 * @public
 */
export class StepSearchStarterPacks<P, C = null, O extends StepSearchStarterPacksOutput = StepSearchStarterPacksOutput> extends StepStarterPacks<P, C, O> {

  /**
   * The initial query parameters for the search.
   */
  _queryParams: StepSearchStarterPacksQueryParams

  /**
   * Initializes the StepSearchStarterPacks instance with the given agent, parent, and query parameters.
   *
   * @param agent - The AT protocol agent used for API calls.
   * @param parent - The parent step in the chain.
   * @param queryParams - The initial query parameters for the search.
   */
  constructor (agent: AtpAgent, parent: P, queryParams: StepSearchStarterPacksQueryParams) {
    super(agent, parent)
    this._queryParams = queryParams
  }

  /**
   * Clones the current step and returns a new instance with the same parameters.
   * @param rest - Additional parameters to pass to the cloned step. This is useful for child class overriding the clone.
   * @returns A new {@link StepSearchStarterPacks} instance.
   */
  override clone (...rest: unknown[]) {
    const step = super.clone(...rest)
    step._queryParams = this._queryParams
    return step
  }

  /**
   * Applies the pagination logic to retrieve starter packs based on the search parameters.
   * Results are stored in the `output` property.
   *
   * @override
   */
  async applyPagination () {
    this.output = await this.paginate<O, AppBskyGraphSearchStarterPacks.Response>("starterPacks", (cursor) => {
      return this
        .agent
        .app.bsky.graph
        .searchStarterPacks(this.queryParams(cursor))
    })
  }

  /**
   * Constructs the query parameters for the current pagination step.
   *
   * @param cursor - The cursor indicating the current position in the paginated results.
   * @returns The query parameters for the search.
   */
  queryParams (cursor: StepSearchStarterPacksQueryParamsCursor): StepSearchStarterPacksQueryParams {
    return { ...this._queryParams, cursor }
  }
}
