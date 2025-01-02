import type { AppBskyGraphGetFollowers } from '@atproto/api'
import { StepActor, StepActors } from '../trotsky'

type StepActorFollowersContext = AppBskyGraphGetFollowers.OutputSchema['followers']
type StepActorFollowersQueryParams = AppBskyGraphGetFollowers.QueryParams
type StepActorFollowersQueryParamsCursor = StepActorFollowersQueryParams['cursor'] | undefined

export class StepActorFollowers extends StepActors {
  override _context: StepActorFollowersContext = []

  override back(): StepActor {
    return super.back() as StepActor
  }

  async applyPagination() {
    this._context = await this.paginate<StepActorFollowersContext, AppBskyGraphGetFollowers.Response>('followers', (cursor) => {
      return this.agent.app.bsky.graph.getFollowers(this.queryParams(cursor))
    })
  }

  queryParams(cursor: StepActorFollowersQueryParamsCursor): StepActorFollowersQueryParams {
    return { actor: this.back().context.did, cursor }
  }
}