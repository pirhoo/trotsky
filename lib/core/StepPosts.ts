import type { AppBskyFeedDefs } from "@atproto/api"

import type { StepBuilder } from "../trotsky"
import { StepList, StepPostsEntry } from "../trotsky"

export type StepPostsOutput = AppBskyFeedDefs.PostView[]

export abstract class StepPosts<P = StepBuilder, C = null, O extends StepPostsOutput = StepPostsOutput> extends StepList<P, C, O> {
  _steps: StepPostsEntry<this>[] = []

  each (): StepPostsEntry<this> {
    return this.append(StepPostsEntry<this>)
  }
}