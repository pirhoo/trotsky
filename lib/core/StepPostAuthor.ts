import { StepActor, type StepActorOutput, type StepPost, type StepPostOutput } from "../trotsky"

/**
 * Represents the output of the `StepPostAuthor`, which is equivalent to {@link StepActorOutput}.
 * @public
 */
export type StepPostAuthorOutput = StepActorOutput

/**
 * Represents a step for retrieving the profile of the author of a specific post.
 * Extends {@link StepActor} to reuse actor-related logic.
 *
 * @typeParam P - The parent type of this step, defaulting to {@link StepPost}.
 * @typeParam C - The context type, defaulting to {@link StepPostOutput}.
 * @typeParam O - The output type, defaulting to {@link StepPostAuthorOutput}.
 *
 * @example
 * Get the author of a post:
 * ```ts
 * await Trotsky.init(agent)
 *   .post("at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.post/3l6oveex3ii2l")
 *   .author()
 *   .tap((step) => {
 *     console.log(`Author: ${step.context.handle}`)
 *     console.log(`Followers: ${step.context.followersCount}`)
 *   })
 *   .run()
 * ```
 *
 * @example
 * Follow authors of interesting posts:
 * ```ts
 * await Trotsky.init(agent)
 *   .searchPosts({ q: "typescript" })
 *   .take(10)
 *   .each()
 *   .when((step) => step?.context?.likeCount > 15)
 *   .author()
 *   .follow()
 *   .wait(2000)
 *   .run()
 * ```
 *
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
