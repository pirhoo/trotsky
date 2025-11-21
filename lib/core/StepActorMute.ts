import { Step, type StepActor, type StepActorOutput } from "../trotsky"

/**
 * Represents a step that performs an actor mute operation using the Bluesky API.
 *
 * @typeParam P - Type of the parent step, extending {@link StepActor}.
 * @typeParam C - Type of the context object, extending {@link StepActorOutput}.
 * @typeParam O - Type of the output object.
 *
 * @example
 * Mute a specific actor:
 * ```ts
 * await Trotsky.init(agent)
 *   .actor("spammer.bsky.social")
 *   .mute()
 *   .run()
 * ```
 *
 * @example
 * Mute actors with specific criteria:
 * ```ts
 * await Trotsky.init(agent)
 *   .searchPosts({ q: "spam keyword" })
 *   .take(10)
 *   .each()
 *   .author()
 *   .mute()
 *   .wait(1000)
 *   .run()
 * ```
 *
 * @public
 */
export class StepActorMute<P = StepActor, C extends StepActorOutput = StepActorOutput, O = null> extends Step<P, C, O> {

  /**
   * Applies the step by performing a mute operation.
   * Requires the context to provide the `did` of the actor to mute.
   * @throws Error
   * if no context is found.
   */
  async apply () {
    if (!this.context) {
      throw new Error("No context found for StepActorMute")
    }

    const actor = this.context.did
    await this.agent.mute(actor)
  }
}
