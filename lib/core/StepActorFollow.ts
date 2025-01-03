import {
  Step, 
  type StepActor, 
  type StepActorOutput 
} from "../trotsky"

export class StepActorFollow<P = StepActor, C extends StepActorOutput = StepActorOutput, O = null> extends Step<P, C, O> {
  async apply () {
    if (!this.context) {
      throw new Error("No context found for StepActorFollow")
    }

    await this.agent.follow(this.context.did)
  }
}
