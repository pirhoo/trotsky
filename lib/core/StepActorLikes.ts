import type { AppBskyFeedGetActorLikes } from '@atproto/api'
import { StepActor, StepList } from '../trotsky'


type StepActorLikesContext = AppBskyFeedGetActorLikes.OutputSchema['likes']
type StepActorLikesQueryParams = AppBskyFeedGetActorLikes.QueryParams
type StepActorLikesQueryParamsCursor = StepActorLikesQueryParams['cursor'] | undefined

export class StepActorLikes extends StepList {
  override _context: StepActorLikesContext = []

  override back(): StepActor {
    return super.back() as StepActor
  }
  
  async apply() {
    this._context = await this.iterator<StepActorLikesContext, AppBskyFeedGetActorLikes.Response>('feed', (cursor) => {
      return this.agent.app.bsky.feed.getActorLikes(this.queryParams(cursor))
    })
  }

  queryParams(cursor: StepActorLikesQueryParamsCursor): StepActorLikesQueryParams {
    return { actor: this.back().context.did, cursor }
  }
}