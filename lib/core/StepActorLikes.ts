import type { AppBskyFeedGetActorLikes } from '@atproto/api'
import { StepActor, StepList } from '../trotsky'


type StepActorLikesContext = AppBskyFeedGetActorLikes.OutputSchema['feed']
type StepActorLikesQueryParams = AppBskyFeedGetActorLikes.QueryParams
type StepActorLikesQueryParamsCursor = StepActorLikesQueryParams['cursor'] | undefined

export class StepActorLikes extends StepList {
  override _context: StepActorLikesContext = []

  override back(): StepActor {
    return super.back() as StepActor
  }
  
  async applyPagination() {
    this._context = await this.paginate<StepActorLikesContext, AppBskyFeedGetActorLikes.Response>('feed', (cursor) => {
      return this.agent.app.bsky.feed.getActorLikes(this.queryParams(cursor))
    })
  }

  queryParams(cursor: StepActorLikesQueryParamsCursor): StepActorLikesQueryParams {
    return { actor: this.back().context.did, cursor }
  }
}