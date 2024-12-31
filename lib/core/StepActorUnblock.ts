import { Step } from "../trotsky"

export class StepActorUnblock extends Step {
  async apply() {
    console.log('Unblock actor')
  }
}
