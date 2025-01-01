import type { AppBskyFeedGetAuthorFeed } from '@atproto/api'
import { StepActor, StepList } from '../trotsky'


type StepActorPostsContext = AppBskyFeedGetAuthorFeed.OutputSchema['likes']
type StepActorPostsQueryParams = AppBskyFeedGetAuthorFeed.QueryParams
type StepActorPostsQueryParamsCursor = StepActorPostsQueryParams['cursor'] | undefined

export class StepActorPosts extends StepList {
  override _context: StepActorPostsContext = []

  override back(): StepActor {
    return super.back() as StepActor
  }
  
  async apply() {
    this._context = await this.paginate<StepActorPostsContext, AppBskyFeedGetAuthorFeed.Response>('feed', (cursor) => {
      return this.agent.app.bsky.feed.getAuthorFeed(this.queryParams(cursor))
    })
  }

  queryParams(cursor: StepActorPostsQueryParamsCursor): StepActorPostsQueryParams {
    return { actor: this.back().context.did, cursor }
  }
}