import { StepActor, StepList } from '../trotsky'

export class StepActorLikes extends StepList {
  override back(): StepActor {
    return super.back() as StepActor
  }
  
  async apply() {
    console.log('Get actor likes')
  }
}