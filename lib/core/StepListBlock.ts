import { Step, type StepList, type StepListOutput } from "../trotsky"

/**
 * Represents a step that performs a list block operation using the Bluesky API.
 * Blocking a list prevents content from users on that list from appearing.
 *
 * @typeParam P - Type of the parent step, extending {@link StepList}.
 * @typeParam C - Type of the context object, extending {@link StepListOutput}.
 * @typeParam O - Type of the output object.
 *
 * @example
 * Block a specific list:
 * ```ts
 * await Trotsky.init(agent)
 *   .list("at://did:plc:example/app.bsky.graph.list/listid")
 *   .block()
 *   .run()
 * ```
 *
 * @public
 */
export class StepListBlock<P = StepList, C extends StepListOutput = StepListOutput, O = null> extends Step<P, C, O> {

  /**
   * Applies the step by performing a list block operation.
   * Requires the context to provide the `uri` of the list to block.
   * @throws Error if no context is found.
   */
  async apply () {
    if (!this.context) {
      throw new Error("No context found for StepListBlock")
    }

    const repo = this.agent.did!
    const subject = this.context.uri
    const createdAt = new Date().toISOString()
    await this.agent.app.bsky.graph.listblock.create({ repo }, { subject, createdAt })
  }
}
