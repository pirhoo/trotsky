import { AtUri } from "@atproto/api"

import { Step, type StepList, type StepListOutput } from "../trotsky"

/**
 * Represents a step that performs a list unblock operation using the Bluesky API.
 * Unblocking a list allows content from users on that list to appear again.
 *
 * @typeParam P - Type of the parent step, extending {@link StepList}.
 * @typeParam C - Type of the context object, extending {@link StepListOutput}.
 * @typeParam O - Type of the output object.
 *
 * @example
 * Unblock a specific list:
 * ```ts
 * await Trotsky.init(agent)
 *   .list("at://did:plc:example/app.bsky.graph.list/listid")
 *   .unblock()
 *   .run()
 * ```
 *
 * @public
 */
export class StepListUnblock<P = StepList, C extends StepListOutput = StepListOutput, O = null> extends Step<P, C, O> {

  /**
   * Applies the step by performing a list unblock operation.
   * Requires the context to provide the `viewer.blocked` URI.
   * @throws Error if no context is found.
   */
  async apply () {
    if (!this.context) {
      throw new Error("No context found for StepListUnblock")
    }

    // Check if the list is currently blocked
    const blockUri = this.context.viewer?.blocked
    if (!blockUri) {
      // List is not blocked, nothing to do
      return
    }

    const repo = this.agent.did!
    const { rkey } = new AtUri(blockUri)
    await this.agent.app.bsky.graph.listblock.delete({ repo, rkey })
  }
}
