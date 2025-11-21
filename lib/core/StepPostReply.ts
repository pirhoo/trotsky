import type { AppBskyFeedPost, AtpAgent } from "@atproto/api"
import type { ResolvablePostReplyParams, PostReplyParams } from "./mixins/PostMixins"
import { resolveValue } from "./utils/resolvable"

import { Step, type StepPost, type StepPostOutput } from "../trotsky"

/**
 * Represents a reference to a post record, including its URI and CID.
 * @public
 */
export interface StepPostReplyRecordRef {
  "uri": string;
  "cid": string;
}

/**
 * Represents the reply structure, containing references to both the parent and root posts.
 * @public
 */
export interface StepPostReplyRef {
  "parent": StepPostReplyRecordRef;
  "root": StepPostReplyRecordRef;
}

/**
 * Represents the output of a post reply step, including the URI and CID of the reply.
 * @public
 */
export type StepPostReplyOutput = StepPostReplyRecordRef

/**
 * Represents a step for replying to a specific post.
 *
 * @typeParam P - The parent type of this step, defaulting to {@link StepPost}.
 * @typeParam C - The context type, defaulting to {@link StepPostOutput}.
 * @typeParam O - The output type, defaulting to {@link StepPostReplyOutput}.
 *
 * @example
 * Reply to a specific post:
 * ```ts
 * await Trotsky.init(agent)
 *   .post("at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.post/3l6oveex3ii2l")
 *   .reply({ text: "Great post! 👍" })
 *   .run()
 * ```
 *
 * @example
 * Reply to posts mentioning pizza:
 * ```ts
 * await Trotsky.init(agent)
 *   .searchPosts({ q: "pizza" })
 *   .take(3)
 *   .each()
 *   .reply({ text: "🍕 Pizza party! 🍕" })
 *   .wait(1000)
 *   .run()
 * ```
 *
 * @public
 */
export class StepPostReply<P = StepPost, C extends StepPostOutput = StepPostOutput, O extends StepPostReplyOutput = StepPostReplyOutput> extends Step<P, C, O> {

  /**
   * The record containing the reply parameters, which can be resolved dynamically at runtime.
   */
  _record: ResolvablePostReplyParams

  /**
   * Initializes the StepPostReply instance with the given agent, parent, and reply record parameters.
   * 
   * @param agent - The AT protocol agent used for API calls.
   * @param parent - The parent step in the chain.
   * @param record - The reply parameters, possibly resolvable at runtime.
   */
  constructor (agent: AtpAgent, parent: P, record: ResolvablePostReplyParams) {
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
   * Applies the step logic to create a reply to the post provided in the context.
   * The resulting URI and CID of the reply are stored in the output.
   * 
   * @override
   */
  async apply () {
    this.output = await this.agent.post(await this.queryParams()) as O
  }

  /**
   * Resolves the query parameters for the reply, including reply references and creation time.
   * 
   * @returns A promise that resolves to the complete reply record.
   */
  async queryParams (): Promise<AppBskyFeedPost.Record> {
    const params = await resolveValue<PostReplyParams>(this, this._record)
    const createdAt = new Date().toISOString()
    const reply = this.replyParams()
    return {
      "$type": "app.bsky.feed.post",
      createdAt,
      reply,
      ...params
    }
  }

  /**
   * Constructs the reply parameters for the post, including parent and root references.
   * 
   * @returns An object containing the root and parent references for the reply.
   */
  replyParams (): AppBskyFeedPost.Record["reply"] {
    const post = this.context as C & { "record"?: { "reply"?: StepPostReplyRef } }
    const reply = post?.record?.reply ?? null
    const parent = { "uri": post.uri, "cid": post.cid }
    const root = reply ? { "uri": reply.root.uri, "cid": reply.root.cid } : parent
    return { root, parent }
  }
}
