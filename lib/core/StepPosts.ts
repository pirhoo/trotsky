import { StepList, StepPostsEntry } from '../trotsky'


export class StepPosts extends StepList {
  _steps: StepPostsEntry<this>[] = []

  each(): StepPostsEntry<this> {
    return this.append(StepPostsEntry<this>)
  }
  
  async applyPagination(): Promise<void> {
    throw new Error('`applyPagination` not implemented.')
  }
}