import type { AtUri, AppBskyFeedGetPosts, AtpAgent, AppBskyActorDefs } from "@atproto/api"

import type { StepBuilder } from "../trotsky"
import type { Resolvable } from "./utils/resolvable"
import { PostMixins } from "./mixins/PostMixins"
import { resolveValue } from "./utils/resolvable"

/**
 * Defines the query parameters for retrieving a post.
 * @public
 */
export type StepPostQueryParams = AppBskyFeedGetPosts.QueryParams

/**
 * Represents a post's URI, which can be a string or an {@link AtUri}.
 * @public
 */
export type StepPostUri = string | AtUri

/**
 * Represents the output of a retrieved post, including its URI, CID, record data, and author profile.
 */
export type StepPostOutput = { 
  "uri": string;
  "cid": string;
  "record": object;
  "author": AppBskyActorDefs.ProfileViewBasic;
}

/**
 * Represents a step for retrieving a post by its URI.
 * Extends {@link PostMixins} for post-related operations.
 * 
 * @typeParam P - The parent type of this step, defaulting to {@link StepBuilder}.
 * @typeParam C - The child context type, defaulting to `null`.
 * @typeParam O - The output type, defaulting to {@link StepPostOutput}.
 * @public
 */
export class StepPost<P = StepBuilder, C = null, O extends StepPostOutput = StepPostOutput> extends PostMixins<P, C, O> {

  /**
   * The URI of the post to retrieve, which can be resolved dynamically at runtime.
   */
  _uri: Resolvable<StepPostUri>

  /**
   * Initializes the StepPost instance with the given agent, parent, and URI.
   * 
   * @param agent - The AT protocol agent used for API calls.
   * @param parent - The parent step in the chain.
   * @param uri - The URI of the post to retrieve, possibly resolvable at runtime.
   */
  constructor (agent: AtpAgent, parent: P, uri: Resolvable<StepPostUri>) {
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
   * Applies the step logic to retrieve the post and sets the output to the retrieved post's data.
   * If no posts are found, the output is set to `null`.
   * 
   * @override
   */
  async apply () {
    const { "data": { posts } } = await this.agent.getPosts(await this.queryParams())
    this.output = (posts.length ? posts[posts.length - 1] : null) as O | null
  }

  /**
   * Resolves the query parameters for retrieving the post, including its URI.
   * 
   * @returns A promise that resolves to the query parameters.
   */
  async queryParams (): Promise<StepPostQueryParams> {
    const uri = await resolveValue<StepPostUri>(this, this._uri)
    const uris = [uri.toString?.() ?? uri]
    return { uris }
  }
}
