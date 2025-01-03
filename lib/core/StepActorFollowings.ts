import type { AppBskyGraphGetFollows } from '@atproto/api'

import { StepActors, type StepActor, type StepActorOutput } from '../trotsky'

type StepActorFollowingsOutput = AppBskyGraphGetFollows.OutputSchema['follows']
type StepActorFollowingsQueryParams = AppBskyGraphGetFollows.QueryParams
type StepActorFollowingsQueryParamsCursor = StepActorFollowingsQueryParams['cursor'] | undefined

export class StepActorFollowings<P = StepActor, C extends StepActorOutput = StepActorOutput, O extends StepActorFollowingsOutput = StepActorFollowingsOutput> extends StepActors<P, C, O> {

  async applyPagination() {
    this.output = await this.paginate<O, AppBskyGraphGetFollows.Response>('follows', (cursor) => {
      return this.agent.app.bsky.graph.getFollows(this.queryParams(cursor))
    })
  }

  queryParams(cursor: StepActorFollowingsQueryParamsCursor): StepActorFollowingsQueryParams {
    if (!this.context) {
      throw new Error('No context found for StepActorFollowings')
    }
  
    return { actor: this.context.did, cursor }
  }
}