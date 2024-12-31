import { StepList, StepPostsEntry } from '../trotsky'


export class StepPosts extends StepList {
  override _steps: StepPostsEntry<this>[] = []

  each(): StepPostsEntry<this> {
    return this.append(StepPostsEntry<this>)
  }
}
