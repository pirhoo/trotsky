import type { AppBskyFeedSearchPosts } from '@atproto/api'

import { StepPosts } from '../trotsky'

type StepSearchPostsContext = AppBskyFeedSearchPosts.OutputSchema['posts']
type StepSearchPostsContextQueryParams = AppBskyFeedSearchPosts.QueryParams
type StepSearchPostsContextQueryParamsCursor = StepSearchPostsContextQueryParams['cursor'] | undefined

export class StepSearchPosts extends StepPosts {
  _queryParams: StepSearchPostsContextQueryParams
  _context: StepSearchPostsContext = []

  constructor(agent, parent, queryParams: StepSearchPostsContextQueryParams) {
    super(agent, parent)
    this._queryParams = queryParams
  }

  async applyPagination() {
    this._context = await this.paginate<StepSearchPostsContext, AppBskyFeedSearchPosts.Response>('posts', (cursor) => {
      return this
        .agent
        .app.bsky.feed
        .searchPosts(this.queryParams(cursor))
    })
  }

  queryParams(cursor: StepSearchPostsContextQueryParamsCursor): StepSearchPostsContextQueryParams {
    return { ...this._queryParams, cursor }
  }
}