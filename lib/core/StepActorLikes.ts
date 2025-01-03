import type { AppBskyFeedGetActorLikes } from '@atproto/api'

import { StepPosts, type StepPostsOutput, type StepActor, type StepActorOutput } from '../trotsky'


type StepActorLikesOutput = StepPostsOutput
type StepActorLikesQueryParams = AppBskyFeedGetActorLikes.QueryParams
type StepActorLikesQueryParamsCursor = StepActorLikesQueryParams['cursor'] | undefined


export class StepActorLikes<P = StepActor, C extends StepActorOutput = StepActorOutput, O extends StepActorLikesOutput = StepActorLikesOutput> extends StepPosts<P, C, O>{

  async applyPagination() {
    this.output = await this.paginate<O, AppBskyFeedGetActorLikes.Response>('feed', (cursor) => {
      return this.agent.app.bsky.feed.getActorLikes(this.queryParams(cursor))
    })
  }

  queryParams(cursor: StepActorLikesQueryParamsCursor): StepActorLikesQueryParams {
    if (!this.context) {
      throw new Error('No context found for StepActorLikes')
    }

    return { actor: this.context.did, cursor }
  }
}