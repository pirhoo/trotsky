import { Step, type StepPost, type StepPostOutput } from "../trotsky"

/**
 * Represents a step that performs a thread unmute operation using the Bluesky API.
 * Unmuting a thread re-enables notifications for that thread.
 *
 * @typeParam P - Type of the parent step, extending {@link StepPost}.
 * @typeParam C - Type of the context object, extending {@link StepPostOutput}.
 * @typeParam O - Type of the output object.
 *
 * @example
 * Unmute a specific thread:
 * ```ts
 * await Trotsky.init(agent)
 *   .post("at://did:plc:example/app.bsky.feed.post/postid")
 *   .threadUnmute()
 *   .run()
 * ```
 *
 * @public
 */
export class StepThreadUnmute<P = StepPost, C extends StepPostOutput = StepPostOutput, O = null> extends Step<P, C, O> {

  /**
   * Applies the step by performing a thread unmute operation.
   * Requires the context to provide the root post URI.
   * @throws Error if no context is found.
   */
  async apply () {
    if (!this.context) {
      throw new Error("No context found for StepThreadUnmute")
    }

    // Use the post's URI to get the root of the thread
    await this.agent.app.bsky.graph.unmuteThread({ "root": this.context.uri })
  }
}
