import { AtUri } from '@atproto/api'

import matchProperty from "./utils/matchProperty"
import { Step, type StepActor, type StepActorOutput } from "../trotsky"

export class StepActorUnblock<P = StepActor, C extends StepActorOutput = StepActorOutput, O = null> extends Step<P, C, O> {
  async apply() {    
    if (!this.context) {
      throw new Error('No context found for StepActorUnblock')
    }
    
    const { data: { blocks } } = await this.agent.app.bsky.graph.getBlocks()
    const block = blocks.find(matchProperty('did', this.context.did))
    // if the block does not exist, there is nothing to do
    if (!block?.viewer?.blocking) return
    const repo = this.agent.did
    const { rkey } = new AtUri(block.viewer.blocking)
    await this.agent.app.bsky.graph.block.delete({ repo, rkey })
  }
}
