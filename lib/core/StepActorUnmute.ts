import { Step, type StepActor, type StepActorOutput } from "../trotsky"

/**
 * Represents step that unmutes the current actor (if muted).
 *
 * @typeParam P - The parent step type, defaulting to {@link StepActor}.
 * @typeParam C - The context or child output type, defaulting to {@link StepActorOutput}.
 * @typeParam O - The output type produced by this step, defaulting to `null`.
 *
 * @example
 * Unmute a specific actor:
 * ```ts
 * await Trotsky.init(agent)
 *   .actor("user.bsky.social")
 *   .unmute()
 *   .run()
 * ```
 *
 * @example
 * Unmute all muted accounts:
 * ```ts
 * const { data: { mutes } } = await agent.app.bsky.graph.getMutes()
 *
 * await Trotsky.init(agent)
 *   .actors(mutes.map(m => m.did))
 *   .each()
 *   .unmute()
 *   .wait(1000)
 *   .run()
 * ```
 *
 * @public
 */
export class StepActorUnmute<P = StepActor, C extends StepActorOutput = StepActorOutput, O = null> extends Step<P, C, O> {

  /**
   * Applies the unmute logic by calling the unmute API endpoint.
   *
   * @throws Error
   * If no context is available for the step, indicating the actor is unknown.
   */
  async apply () {
    if (!this.context) {
      throw new Error("No context found for StepActorUnmute")
    }

    const actor = this.context.did
    await this.agent.unmute(actor)
  }
}
