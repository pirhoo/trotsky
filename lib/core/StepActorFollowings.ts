import type { AppBskyGraphGetFollows } from '@atproto/api'
import { StepActor, StepActors } from '../trotsky'

type StepActorFollowingsContext = AppBskyGraphGetFollows.OutputSchema['follows']
type StepActorFollowingsQueryParams = AppBskyGraphGetFollows.QueryParams
type StepActorFollowingsQueryParamsCursor = StepActorFollowingsQueryParams['cursor'] | undefined

export class StepActorFollowings extends StepActors {
  override _context: StepActorFollowingsContext = []

  override back(): StepActor {
    return super.back() as StepActor
  }

  async applyPagination() {
    this._context = await this.paginate<StepActorFollowingsContext, AppBskyGraphGetFollows.Response>('follows', (cursor) => {
      return this.agent.app.bsky.graph.getFollows(this.queryParams(cursor))
    })
  }

  queryParams(cursor: StepActorFollowingsQueryParamsCursor): StepActorFollowingsQueryParams {
    return { actor: this.back().context.did, cursor }
  }
}