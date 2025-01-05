import type { AppBskyFeedDefs } from "@atproto/api"

import type { ParentConstraint } from "../trotsky"
import { StepList, StepPostsEntry } from "../trotsky"

export type StepPostsOutput = AppBskyFeedDefs.PostView[]

export abstract class StepPosts<P = ParentConstraint, C = null, O extends StepPostsOutput = StepPostsOutput> extends StepList<P, C, O> {
  _steps: StepPostsEntry<this>[] = []

  each (): StepPostsEntry<this> {
    return this.append(StepPostsEntry<this>)
  }
}