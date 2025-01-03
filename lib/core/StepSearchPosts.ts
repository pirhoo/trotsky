import type { AppBskyFeedSearchPosts, AtpAgent } from "@atproto/api"

import { StepPosts } from "../trotsky"

type StepSearchPostsOutput = AppBskyFeedSearchPosts.OutputSchema["posts"]
type StepSearchPostsQueryParams = AppBskyFeedSearchPosts.QueryParams
type StepSearchPostsQueryParamsCursor = StepSearchPostsQueryParams["cursor"] | undefined

export class StepSearchPosts<P, C = null, O extends StepSearchPostsOutput = StepSearchPostsOutput> extends StepPosts<P, C, O> {
  _queryParams: StepSearchPostsQueryParams

  constructor (agent: AtpAgent, parent: P, queryParams: StepSearchPostsQueryParams) {
    super(agent, parent)
    this._queryParams = queryParams
  }

  async applyPagination () {
    this.output = await this.paginate<O, AppBskyFeedSearchPosts.Response>("posts", (cursor) => {
      return this
        .agent
        .app.bsky.feed
        .searchPosts(this.queryParams(cursor))
    })
  }

  queryParams (cursor: StepSearchPostsQueryParamsCursor): StepSearchPostsQueryParams {
    return { ...this._queryParams, cursor }
  }
}