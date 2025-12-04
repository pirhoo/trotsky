import { Step, type StepPost, type StepPostOutput } from "../trotsky"

/**
 * Represents a step that performs a thread mute operation using the Bluesky API.
 * Muting a thread hides notifications for that thread.
 *
 * @typeParam P - Type of the parent step, extending {@link StepPost}.
 * @typeParam C - Type of the context object, extending {@link StepPostOutput}.
 * @typeParam O - Type of the output object.
 *
 * @example
 * Mute a specific thread:
 * ```ts
 * await Trotsky.init(agent)
 *   .post("at://did:plc:example/app.bsky.feed.post/postid")
 *   .threadMute()
 *   .run()
 * ```
 *
 * @public
 */
export class StepThreadMute<P = StepPost, C extends StepPostOutput = StepPostOutput, O = null> extends Step<P, C, O> {

  /**
   * Applies the step by performing a thread mute operation.
   * Requires the context to provide the root post URI.
   * @throws Error if no context is found.
   */
  async apply () {
    if (!this.context) {
      throw new Error("No context found for StepThreadMute")
    }

    // Use the post's URI to get the root of the thread
    await this.agent.app.bsky.graph.muteThread({ "root": this.context.uri })
  }
}
