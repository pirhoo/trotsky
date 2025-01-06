import { StepActor, type StepActorOutput, type StepPost, type StepPostOutput } from "../trotsky"

/**
 * Represents the output of the `StepPostAuthor`, which is equivalent to {@link StepActorOutput}.
 * @public
 */
export type StepPostAuthorOutput = StepActorOutput

/**
 * A step for retrieving the profile of the author of a specific post.
 * Extends {@link StepActor} to reuse actor-related logic.
 * 
 * @typeParam P - The parent type of this step, defaulting to {@link StepPost}.
 * @typeParam C - The context type, defaulting to {@link StepPostOutput}.
 * @typeParam O - The output type, defaulting to {@link StepPostAuthorOutput}.
 * @public
 */
export class StepPostAuthor<P = StepPost, C extends StepPostOutput = StepPostOutput, O extends StepPostAuthorOutput = StepPostAuthorOutput> extends StepActor<P, C, O> {

  /**
   * Applies the step logic to retrieve the profile of the author of the post.
   * 
   * @throws Error
   * If no context is available for the step, indicating the post is unknown.
   */
  async apply () {
    if (!this.context) {
      throw new Error("No context found for StepPostAuthor")
    }
    
    const actor = this.context.author.did
    const { data } = await this.agent.getProfile({ actor })
    this.output = data as O
  }
}
