import type { AtUri, AppBskyFeedGetPosts, AtpAgent, AppBskyActorDefs } from "@atproto/api"

import type { StepBuilder } from "../trotsky"
import type { Resolvable } from "./utils/resolvable"
import { PostMixins } from "./mixins/PostMixins"
import { resolveValue } from "./utils/resolvable"

export type StepPostQueryParams = AppBskyFeedGetPosts.QueryParams
export type StepPostUri = string | AtUri
export type StepPostOutput = { "uri": string; "cid": string; "record": object; "author": AppBskyActorDefs.ProfileViewBasic  }

export class StepPost<P = StepBuilder, C = null, O extends StepPostOutput = StepPostOutput> extends PostMixins<P, C, O> {
  _uri: Resolvable<StepPostUri>

  constructor (agent: AtpAgent, parent: P, uri: Resolvable<StepPostUri>) {
    super(agent, parent)
    this._uri = uri
  }

  async apply () {
    const { "data": { posts } } = await this.agent.getPosts(await this.queryParams())
    this.output = (posts.length ? posts[posts.length - 1] : null) as O | null
  }

  async queryParams (): Promise<StepPostQueryParams> {
    const uri = await resolveValue<StepPostUri>(this, this._uri)
    const uris = [uri.toString?.() ?? uri]
    return { uris }
  }
}
