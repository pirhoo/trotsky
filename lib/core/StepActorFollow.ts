import { Step } from "../trotsky"

export class StepActorFollow extends Step {
  async apply() {
    await this.agent.follow(this.context.did)
  }
}
