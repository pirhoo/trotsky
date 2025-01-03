import type { AppBskyGraphGetFollowers } from "@atproto/api"

import {
  StepActors, 
  type StepActor, 
  type StepActorOutput 
} from "../trotsky"

type StepActorFollowersOutput = AppBskyGraphGetFollowers.OutputSchema["followers"]
type StepActorFollowersQueryParams = AppBskyGraphGetFollowers.QueryParams
type StepActorFollowersQueryParamsCursor = StepActorFollowersQueryParams["cursor"] | undefined

export class StepActorFollowers<P = StepActor, C extends StepActorOutput = StepActorOutput, O extends StepActorFollowersOutput = StepActorFollowersOutput> extends StepActors<P, C, O> {  
  async applyPagination () {
    this.output = await this.paginate<O, AppBskyGraphGetFollowers.Response>("followers", (cursor) => {
      return this.agent.app.bsky.graph.getFollowers(this.queryParams(cursor))
    })
  }

  private queryParams (cursor: StepActorFollowersQueryParamsCursor): StepActorFollowersQueryParams {
    if (!this.context) {
      throw new Error("No context found for StepActorFollowers")
    }
  
    return { "actor": this.context.did, cursor }
  }
}