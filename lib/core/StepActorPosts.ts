import type { AppBskyFeedGetAuthorFeed } from '@atproto/api'

import { StepPosts, type StepPostsOutput, type StepActor, type StepActorOutput } from '../trotsky'

type StepActorPostsOutput = StepPostsOutput
type StepActorPostsQueryParams = AppBskyFeedGetAuthorFeed.QueryParams
type StepActorPostsQueryParamsCursor = StepActorPostsQueryParams['cursor'] | undefined


export class StepActorPosts<P = StepActor, C extends StepActorOutput = StepActorOutput, O extends StepActorPostsOutput = StepActorPostsOutput> extends StepPosts<P, C, O>{
  
  async applyPagination() {
    this.output = await this.paginate<O, AppBskyFeedGetAuthorFeed.Response>('feed', (cursor) => {
      return this.agent.app.bsky.feed.getAuthorFeed(this.queryParams(cursor))
    })
  }

  queryParams(cursor: StepActorPostsQueryParamsCursor): StepActorPostsQueryParams {
    if (!this.context) {
      throw new Error('No context found for StepActorPosts')
    }

    return { actor: this.context.did, cursor }
  }
}