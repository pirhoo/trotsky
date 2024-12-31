import { Step } from "../trotsky"

export class StepActorBlock extends Step {
  async apply() {
    const repo = this.agent.did
    const subject = this.context.did
    const createdAt = new Date().toISOString()
    await this.agent.app.bsky.graph.block.create({ repo }, { subject, createdAt })
  }
}
