import type { AtpAgent, AppBskyFeedPost } from "@atproto/api"

import { Step, type StepBuilder } from "../trotsky"
import { resolveValue, type Resolvable } from "./utils/resolvable"

/**
 * Defines the parameters for creating a new post.
 * Consists of a partial {@link AppBskyFeedPost.Record} but excludes `createdAt`.
 * @public
 */
export type StepCreatePostParams = Partial<AppBskyFeedPost.Record> & Omit<AppBskyFeedPost.Record, "createdAt">

/**
 * Defines the output of a create-post operation,
 * containing the post's unique URI and CID.
 * @public
 */
export type StepCreatePostOutput = { "uri": string; "cid": string }

/**
 * Represents a {@link StepCreatePostParams} type
 * that may be resolved dynamically at runtime.
 * @public
 */
export type ResolvableStepCreatePostParams = Resolvable<StepCreatePostParams>

/**
 * A step that creates a new post on Bluesky using the specified record parameters.
 * 
 * @typeParam P - The parent step type, defaulting to {@link StepBuilder}.
 * @typeParam C - The child context type, defaulting to `null`.
 * @typeParam O - The output type, defaulting to {@link StepCreatePostOutput}.
 * @public
 */
export class StepCreatePost<P = StepBuilder, C = null, O extends StepCreatePostOutput = StepCreatePostOutput> extends Step<P, C, O> {

  /**
   * Stores the parameters needed to create a post, which may be resolved at runtime.
   */
  _record: ResolvableStepCreatePostParams

  /**
   * Initializes the create-post step with the provided agent, parent, and record parameters.
   * @param agent - The AT protocol agent for making API calls.
   * @param parent - The parent step in the chain.
   * @param record - The post record parameters, possibly resolvable at runtime.
   */
  constructor (agent: AtpAgent, parent: P, record: ResolvableStepCreatePostParams) {
    super(agent, parent)
    this._record = record
  }

  /**
   * Clones the current step and returns a new instance with the same parameters.
   * @param rest - Additional parameters to pass to the cloned step. This is useful for child class overriding the clone.
   * @returns A new {@link StepActor} instance.
   */
  override clone (...rest: unknown[]) {
    return super.clone(this._record, ...rest)
  }

  /**
   * Executes the create-post step by sending a request to the Bluesky service
   * and assigning the returned URI and CID to `this.output`.
   */
  async apply () {
    this.output = await this.agent.post(await this.queryParams()) as O
  }

  /**
   * Resolves the post creation parameters from a potentially dynamic input source.
   * @returns A promise that resolves to the fully populated {@link StepCreatePostParams}.
   */
  async queryParams (): Promise<StepCreatePostParams> {
    return resolveValue<StepCreatePostParams>(this, this._record)
  }
}
