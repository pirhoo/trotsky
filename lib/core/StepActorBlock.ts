import { Step, type StepActor, type StepActorOutput } from "../trotsky"

export class StepActorBlock<P = StepActor, C extends StepActorOutput = StepActorOutput, O = null> extends Step<P, C, O> {
  async apply() {
    if (!this.context) {
      throw new Error('No context found for StepActorBlock')
    }

    const repo = this.agent.did
    const subject = this.context.did
    const createdAt = new Date().toISOString()
    await this.agent.app.bsky.graph.block.create({ repo }, { subject, createdAt })
  }
}
