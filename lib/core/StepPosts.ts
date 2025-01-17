import type { AppBskyFeedDefs, AtpAgent, AtUri } from "@atproto/api"

import { StepBuilderList, StepBuilderListIterator, StepPostsEntry, type StepBuilder } from "../trotsky"
import { Resolvable, resolveValue } from "./utils/resolvable"

/**
 * Type for the parameter passed to the {@link StepPosts} class.
 * Represents the URIs of several post.
 * Bluesky currently limit this to 25 posts.
 * @public
 */
export type StepPostsUris = (string | AtUri)[]


/**
 * Represents the output of a posts step, consisting of an array of post views.
 * @public
 */
export type StepPostsOutput = AppBskyFeedDefs.PostView[]

/**
 * Abstract class representing a list of posts to process.
 * 
 * @typeParam P - The parent type of this step, defaulting to {@link StepBuilder}.
 * @typeParam C - The child context type, defaulting to `null`.
 * @typeParam O - The output type, defaulting to {@link StepPostsOutput}.
 * @public
 */
export class StepPosts<P = StepBuilder, C = null, O extends StepPostsOutput = StepPostsOutput> extends StepBuilderList<P, C, O> {

  /**
   * Holds the list of steps to be executed for each post entry.
   */
  _steps: StepPostsEntry<this>[] = []

  /**
   * The URIs of the posts to retrieve, which can be resolved dynamically at runtime.
   */
  _uris: Resolvable<StepPostsUris>

  /**
   * Initializes the StepPost instance with the given agent, parent, and URI.
   * 
   * @param agent - The AT protocol agent used for API calls.
   * @param parent - The parent step in the chain.
   * @param uris - The URIs of the post sto retrieve, possibly resolvable at runtime.
   */
  constructor (agent: AtpAgent, parent: P, uris: Resolvable<StepPostsUris> = []) {
    super(agent, parent)
    this._uris = uris
  }

  /**
   * Clones the current step and returns a new instance with the same parameters.
   * @param rest - Additional parameters to pass to the cloned step. This is useful for child class overriding the clone.
   * @returns A new {@link StepPosts} instance.
   */
  override clone (...rest: unknown[]) {
    return super.clone(this._uris, ...rest)
  }

  /**
   * Appends a new post entry step to the current list and returns it.
   * 
   * @param iterator - Optional iterator function to be executed for each item in the list.
   * @returns The newly appended {@link StepPostsEntry} instance.
   */
  each (iterator?: StepBuilderListIterator): StepPostsEntry<this> {
    return this.withIterator(iterator).append(StepPostsEntry<this>)
  }

  /**
   * Applies the step by resolving the actor parameter and fetching the actors' profiles.
   * Sets the posts data as the output of this step.
   * @returns A promise that resolves when the step is complete.
   */
  async applyPagination (): Promise<void> {
    const uris = (await resolveValue<StepPostsUris>(this, this._uris)).map(uri => uri.toString())
    const { data } = await this.agent.app.bsky.feed.getPosts({ uris })
    this.output = data.posts as O 
  }
}
