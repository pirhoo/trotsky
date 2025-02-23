import { Step, type StepActor, type StepActorOutput } from "../trotsky"

/**
 * Represents a step that performs an actor block operation using the Bluesky API.
 * @typeParam P - Type of the parent step, extending {@link StepActor}.
 * @typeParam C - Type of the context object, extending {@link StepActorOutput}.
 * @typeParam O - Type of the output object.
 * @public
 */
export class StepActorBlock<P = StepActor, C extends StepActorOutput = StepActorOutput, O = null> extends Step<P, C, O> {
  
  /**
   * Applies the step by performing a block operation.
   * Requires the context to provide the `did` of the actor to block.
   * @throws Error
   * if no context is found.
   */
  async apply () {
    if (!this.context) {
      throw new Error("No context found for StepActorBlock")
    }

    const repo = this.agent.did!
    const subject = this.context.did
    const createdAt = new Date().toISOString()
    await this.agent.app.bsky.graph.block.create({ repo }, { subject, createdAt })
  }
}
