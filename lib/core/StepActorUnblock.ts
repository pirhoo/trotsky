import { AtUri } from '@atproto/api'

import { Step } from "../trotsky"

export class StepActorUnblock extends Step {
  async apply() {
    const { data: { blocks } } = await this.agent.app.bsky.graph.getBlocks()
    const block = blocks.find(b => b.did === this.context.did)
    // if the block does not exist, there is nothing to do
    if (!block?.viewer?.blocking) return
    const repo = this.agent.did
    const { rkey } = new AtUri(block.viewer.blocking)
    await this.agent.app.bsky.graph.block.delete({ repo, rkey })
  }
}
