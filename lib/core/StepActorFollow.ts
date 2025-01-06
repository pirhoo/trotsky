import { Step, type StepActor, type StepActorOutput } from "../trotsky"

/**
 * Represents a step that performs an actor follow operation using the agent.
 * @typeParam P - Type of the parent step, extending {@link StepActor}.
 * @typeParam C - Type of the context object, extending {@link StepActorOutput}.
 * @typeParam O - Type of the output object.
 * @public
 */
export class StepActorFollow<P = StepActor, C extends StepActorOutput = StepActorOutput, O = null> extends Step<P, C, O> {

  /**
   * Applies the step by performing a follow operation.
   * Requires the context to provide the `did` of the actor to follow.
   * @throws
   * Error if no context is found.
   */
  async apply () {
    if (!this.context) {
      throw new Error("No context found for StepActorFollow")
    }

    await this.agent.follow(this.context.did)
  }
}
