import { AtUri } from "@atproto/api"

import matchProperty from "./utils/matchProperty"
import { Step, type StepActor, type StepActorOutput } from "../trotsky"

/**
 * A step that unblocks the current actor (if blocked).
 * 
 * @typeParam P - The parent step type, defaulting to {@link StepActor}.
 * @typeParam C - The context or child output type, defaulting to {@link StepActorOutput}.
 * @typeParam O - The output type produced by this step, defaulting to `null`.
 * @public
 */
export class StepActorUnblock<P = StepActor, C extends StepActorOutput = StepActorOutput, O = null> extends Step<P, C, O> {

  /**
   * Applies the unblock logic:
   * 1. Retrieves the current block list.
   * 2. Checks if the actor is actually blocked.
   * 3. If blocked, deletes the block record to unblock the actor.
   * 
   * @throws Error
   * If no context is available for the step, indicating the actor is unknown.
   */
  async apply () {    
    if (!this.context) {
      throw new Error("No context found for StepActorUnblock")
    }
    
    const { "data": { blocks } } = await this.agent.app.bsky.graph.getBlocks()
    const block = blocks.find(matchProperty("did", this.context.did))
    // If the block does not exist, there is nothing to do
    if (!block?.viewer?.blocking) return

    const repo = this.agent.did
    const { rkey } = new AtUri(block.viewer.blocking)
    await this.agent.app.bsky.graph.block.delete({ repo, rkey })
  }
}
