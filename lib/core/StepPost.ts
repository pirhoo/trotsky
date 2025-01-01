import type { AppBskyFeedGetPosts, AppBskyFeedDefs } from "@atproto/api"
import type { Resolvable } from './utils/resolvable'
import type { AtUri } from '@atproto/api'
import { PostMixins } from "./mixins/PostMixins"
import { resolveValue } from './utils/resolvable'

export type StepPostQueryParams = AppBskyFeedGetPosts.QueryParams
export type StepPostUri = string | AtUri

export class StepPost extends PostMixins {
  _uri: Resolvable<StepPostUri>
  _context: AppBskyFeedDefs.PostView | null = null

  constructor(agent, parent, uri: Resolvable<StepPostUri>) {
    super(agent, parent)
    this._uri = uri
  }

  async apply() {
    const { data: { posts } } = await this.agent.getPosts(await this.queryParams())
    this._context = posts.shift() ?? null
  }

  async queryParams(): Promise<StepPostQueryParams> {
    const uri = await resolveValue<StepPostUri>(this, this._uri)
    const uris = [uri.toString?.() ?? uri]
    return { uris }
  }
}
