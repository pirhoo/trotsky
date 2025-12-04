import type { AppBskyFeedGetQuotes } from "@atproto/api"

import {
  StepPosts,
  type StepPostsOutput,
  type StepPost,
  type StepPostOutput
} from "../trotsky"

/**
 * Type representing the output of the quotes retrieved by {@link StepPostQuotes}.
 * @public
 */
export type StepPostQuotesOutput = StepPostsOutput

/**
 * Type representing the query parameters for retrieving post quotes.
 * @public
 */
export type StepPostQuotesQueryParams = AppBskyFeedGetQuotes.QueryParams

/**
 * Type representing the cursor for paginated queries.
 * @public
 */
export type StepPostQuotesQueryParamsCursor = StepPostQuotesQueryParams["cursor"] | undefined

/**
 * Represents a step for retrieving quote posts of a post using the Bluesky API.
 * Supports paginated retrieval of quote posts.
 *
 * @typeParam P - Type of the parent step, extending {@link StepPost}.
 * @typeParam C - Type of the context object, extending {@link StepPostOutput}.
 * @typeParam O - Type of the output object, extending {@link StepPostQuotesOutput}.
 *
 * @example
 * Get and iterate through quote posts:
 * ```ts
 * await Trotsky.init(agent)
 *   .post("at://did:plc:example/app.bsky.feed.post/postid")
 *   .quotes()
 *   .each()
 *   .tap((step) => {
 *     console.log(`Quote by: ${step.context.author.handle}`)
 *     console.log(`Text: ${step.context.record.text}`)
 *   })
 *   .run()
 * ```
 *
 * @example
 * Like all quote posts:
 * ```ts
 * await Trotsky.init(agent)
 *   .post("at://did:plc:example/app.bsky.feed.post/postid")
 *   .quotes()
 *   .take(10)
 *   .each()
 *   .like()
 *   .wait(2000)
 *   .run()
 * ```
 *
 * @public
 */
export class StepPostQuotes<P = StepPost, C extends StepPostOutput = StepPostOutput, O extends StepPostQuotesOutput = StepPostQuotesOutput> extends StepPosts<P, C, O> {

  /**
   * Applies pagination to retrieve quote posts and sets the output.
   * Fetches paginated results using the agent and appends them to the output.
   */
  async applyPagination () {
    this.output = await this.paginate<O, AppBskyFeedGetQuotes.Response>("posts", (cursor) => {
      return this.agent.app.bsky.feed.getQuotes(this.queryParams(cursor))
    })
  }

  /**
   * Generates query parameters for retrieving quotes, including the optional cursor.
   * @param cursor - The cursor for paginated queries.
   * @returns The query parameters for retrieving quotes.
   * @throws Error if no context is found.
   */
  private queryParams (cursor: StepPostQuotesQueryParamsCursor): StepPostQuotesQueryParams {
    if (!this.context) {
      throw new Error("No context found for StepPostQuotes")
    }

    return { "uri": this.context.uri, cursor }
  }
}
