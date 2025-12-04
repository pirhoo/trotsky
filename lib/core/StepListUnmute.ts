import { Step, type StepList, type StepListOutput } from "../trotsky"

/**
 * Represents a step that performs a list unmute operation using the Bluesky API.
 * Unmuting a list allows content from users on that list to appear again.
 *
 * @typeParam P - Type of the parent step, extending {@link StepList}.
 * @typeParam C - Type of the context object, extending {@link StepListOutput}.
 * @typeParam O - Type of the output object.
 *
 * @example
 * Unmute a specific list:
 * ```ts
 * await Trotsky.init(agent)
 *   .list("at://did:plc:example/app.bsky.graph.list/listid")
 *   .unmute()
 *   .run()
 * ```
 *
 * @public
 */
export class StepListUnmute<P = StepList, C extends StepListOutput = StepListOutput, O = null> extends Step<P, C, O> {

  /**
   * Applies the step by performing a list unmute operation.
   * Requires the context to provide the `uri` of the list to unmute.
   * @throws Error if no context is found.
   */
  async apply () {
    if (!this.context) {
      throw new Error("No context found for StepListUnmute")
    }

    await this.agent.app.bsky.graph.unmuteActorList({ "list": this.context.uri })
  }
}
