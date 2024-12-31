import { StepActor, StepList } from '../trotsky'

export class StepActorPosts extends StepList {
  override back(): StepActor {
    return super.back() as StepActor
  }
  
  async apply() {
    console.log('Get actor posts')
  }
}