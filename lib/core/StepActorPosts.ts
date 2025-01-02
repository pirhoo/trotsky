import type { AppBskyFeedGetAuthorFeed } from '@atproto/api'
import { StepActor, StepPosts } from '../trotsky'

type StepActorPostsContext = AppBskyFeedGetAuthorFeed.OutputSchema['feed']
type StepActorPostsQueryParams = AppBskyFeedGetAuthorFeed.QueryParams
type StepActorPostsQueryParamsCursor = StepActorPostsQueryParams['cursor'] | undefined

export class StepActorPosts extends StepPosts {
  override _context: StepActorPostsContext = []

  override back(): StepActor {
    return super.back() as StepActor
  }
  
  async applyPagination() {
    this._context = await this.paginate<StepActorPostsContext, AppBskyFeedGetAuthorFeed.Response>('feed', (cursor) => {
      return this.agent.app.bsky.feed.getAuthorFeed(this.queryParams(cursor))
    })
  }

  queryParams(cursor: StepActorPostsQueryParamsCursor): StepActorPostsQueryParams {
    return { actor: this.back().context.did, cursor }
  }
}