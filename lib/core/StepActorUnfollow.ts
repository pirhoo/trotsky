import { Step } from "../trotsky"

export class StepActorUnfollow extends Step {
  async apply() {
    console.log('Unfollow actor')
  }
}

