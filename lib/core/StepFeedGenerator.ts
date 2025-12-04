import type { AppBskyFeedGetFeedGenerator, AtpAgent } from "@atproto/api"

import { Step, type Trotsky } from "../trotsky"

/**
 * Type representing the output of the feed generator retrieved by {@link StepFeedGenerator}.
 * @public
 */
export type StepFeedGeneratorOutput = AppBskyFeedGetFeedGenerator.OutputSchema

/**
 * Type representing the URI of a feed generator.
 * @public
 */
export type StepFeedGeneratorUri = string

/**
 * Represents a step for retrieving information about a feed generator using the Bluesky API.
 *
 * @typeParam P - Type of the parent step, extending {@link Trotsky}.
 * @typeParam C - Type of the context object, defaulting to `null`.
 * @typeParam O - Type of the output object, extending {@link StepFeedGeneratorOutput}.
 *
 * @example
 * Get feed generator information:
 * ```ts
 * await Trotsky.init(agent)
 *   .feedGenerator("at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot")
 *   .tap((step) => {
 *     console.log(`Feed: ${step.output.view.displayName}`)
 *     console.log(`Likes: ${step.output.view.likeCount}`)
 *   })
 *   .run()
 * ```
 *
 * @public
 */
export class StepFeedGenerator<P = Trotsky, C = null, O extends StepFeedGeneratorOutput = StepFeedGeneratorOutput> extends Step<P, C, O> {

  /**
   * The URI of the feed generator.
   */
  _feedUri: StepFeedGeneratorUri

  /**
   * Initializes the StepFeedGenerator instance with the given agent, parent, and feed URI.
   *
   * @param agent - The AT protocol agent used for API calls.
   * @param parent - The parent step in the chain.
   * @param feedUri - The URI of the feed generator.
   */
  constructor (agent: AtpAgent, parent: P, feedUri: StepFeedGeneratorUri) {
    super(agent, parent)
    this._feedUri = feedUri
  }

  /**
   * Clones the current step and returns a new instance with the same parameters.
   * @returns A new {@link StepFeedGenerator} instance.
   */
  override clone () {
    return super.clone(this._feedUri)
  }

  /**
   * Applies the step logic to retrieve the feed generator information.
   */
  async apply () {
    const { data } = await this.agent.app.bsky.feed.getFeedGenerator({
      "feed": this._feedUri
    })

    this.output = data as O
  }
}
