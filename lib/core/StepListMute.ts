import { Step, type StepList, type StepListOutput } from "../trotsky"

/**
 * Represents a step that performs a list mute operation using the Bluesky API.
 * Muting a list hides content from users on that list without blocking them.
 *
 * @typeParam P - Type of the parent step, extending {@link StepList}.
 * @typeParam C - Type of the context object, extending {@link StepListOutput}.
 * @typeParam O - Type of the output object.
 *
 * @example
 * Mute a specific list:
 * ```ts
 * await Trotsky.init(agent)
 *   .list("at://did:plc:example/app.bsky.graph.list/listid")
 *   .mute()
 *   .run()
 * ```
 *
 * @public
 */
export class StepListMute<P = StepList, C extends StepListOutput = StepListOutput, O = null> extends Step<P, C, O> {

  /**
   * Applies the step by performing a list mute operation.
   * Requires the context to provide the `uri` of the list to mute.
   * @throws Error if no context is found.
   */
  async apply () {
    if (!this.context) {
      throw new Error("No context found for StepListMute")
    }

    await this.agent.app.bsky.graph.muteActorList({ "list": this.context.uri })
  }
}
