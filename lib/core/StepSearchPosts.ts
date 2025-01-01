import type { AppBskyFeedSearchPosts } from '@atproto/api'

import type { StepPostsEntry } from '../trotsky'
import { StepPosts } from '../trotsky'


type StepSearchPostsContext = AppBskyFeedSearchPosts.OutputSchema['posts']
type StepSearchPostsContextQueryParams = AppBskyFeedSearchPosts.QueryParams
type StepSearchPostsContextQueryParamsCursor = StepSearchPostsContextQueryParams['cursor'] | undefined

export class StepSearchPosts extends StepPosts {
  _queryParams: StepSearchPostsContextQueryParams
  _steps: StepPostsEntry<this>[] = []
  _context: StepSearchPostsContext = []

  constructor(agent, parent, queryParams: StepSearchPostsContextQueryParams) {
    super(agent, parent)
    this._queryParams = queryParams
  }

  async apply() {
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