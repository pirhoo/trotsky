import type {
  AtUri, 
  AppBskyFeedGetPosts, 
  AppBskyFeedDefs, 
  AtpAgent
} from "@atproto/api"

import type { ParentConstraint } from "../trotsky"
import type { Resolvable } from "./utils/resolvable"
import { PostMixins } from "./mixins/PostMixins"
import { resolveValue } from "./utils/resolvable"

export type StepPostQueryParams = AppBskyFeedGetPosts.QueryParams
export type StepPostUri = string | AtUri
export type StepPostOutput = AppBskyFeedDefs.PostView

export class StepPost<P = ParentConstraint, C = null, O extends StepPostOutput = StepPostOutput> extends PostMixins<P, C, O> {
  _uri: Resolvable<StepPostUri>

  constructor (agent: AtpAgent, parent: P, uri: Resolvable<StepPostUri>) {
    super(agent, parent)
    this._uri = uri
  }

  async apply () {
    const { "data": { posts } } = await this.agent.getPosts(await this.queryParams())
    this.output = posts.shift() as O ?? null
  }

  async queryParams (): Promise<StepPostQueryParams> {
    const uri = await resolveValue<StepPostUri>(this, this._uri)
    const uris = [uri.toString?.() ?? uri]
    return { uris }
  }
}
