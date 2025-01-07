import type { AtUri, AtpAgent, AppBskyGraphGetList, AppBskyGraphDefs } from "@atproto/api"

import { ListMixins, type StepBuilder } from "../trotsky"
import type { Resolvable } from "./utils/resolvable"
import { resolveValue } from "./utils/resolvable"

/**
 * Defines the query parameters for retrieving a list.
 * @public
 */
export type StepListQueryParams = AppBskyGraphGetList.QueryParams

/**
 * Represents a list's URI, which can be a string or an {@link AtUri}.
 * @public
 */
export type StepListUri = string | AtUri

/**
 * Represents the output of a retrieved list, including its URI and CID
 */
export type StepListOutput = AppBskyGraphDefs.ListView

/**
 * A step for retrieving a list by its URI.
 * 
 * @typeParam P - The parent type of this step, defaulting to {@link StepBuilder}.
 * @typeParam C - The child context type, defaulting to `null`.
 * @typeParam O - The output type, defaulting to {@link StepListOutput}.
 * @public
 */
export class StepList<P = StepBuilder, C = null, O extends StepListOutput = StepListOutput> extends ListMixins<P, C, O> {

  /**
   * The URI of the list to retrieve, which can be resolved dynamically at runtime.
   */
  _uri: Resolvable<StepListUri>

  /**
   * Initializes the StepList instance with the given agent, parent, and URI.
   * 
   * @param agent - The AT protocol agent used for API calls.
   * @param parent - The parent step in the chain.
   * @param uri - The URI of the list to retrieve, possibly resolvable at runtime.
   */
  constructor (agent: AtpAgent, parent: P, uri: Resolvable<StepListUri>) {
    super(agent, parent)
    this._uri = uri
  }

  /**
   * Clones the current step and returns a new instance with the same parameters.
   * @param rest - Additional parameters to pass to the cloned step. This is useful for child class overriding the clone.
   * @returns A new {@link StepActor} instance.
   */
  override clone (...rest: unknown[]) {
    return super.clone(this._uri, ...rest)
  }

  /**
   * Applies the step logic to retrieve the list and sets the output to the retrieved list's data.
   * If no lists are found, the output is set to `null`.
   * 
   * @override
   */
  async apply () {
    const { "data": { list } } = await this.agent.app.bsky.graph.getList(await this.queryParams())
    this.output = list as O ?? null
  }

  /**
   * Resolves the query parameters for retrieving the list, including its URI.
   * 
   * @returns A promise that resolves to the query parameters.
   */
  async queryParams (): Promise<StepListQueryParams> {
    const uri = await resolveValue<StepListUri>(this, this._uri)
    const list = uri.toString()
    return { list, "limit": 1 }
  }
}
