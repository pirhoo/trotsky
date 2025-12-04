import type { AppBskyFeedGetRepostedBy } from "@atproto/api"

import {
  StepActors,
  type StepActorsOutput,
  type StepPost,
  type StepPostOutput
} from "../trotsky"

/**
 * Type representing the output of the reposters retrieved by {@link StepPostReposters}.
 * @public
 */
export type StepPostRepostersOutput = StepActorsOutput

/**
 * Type representing the query parameters for retrieving post reposters.
 * @public
 */
export type StepPostRepostersQueryParams = AppBskyFeedGetRepostedBy.QueryParams

/**
 * Type representing the cursor for paginated queries.
 * @public
 */
export type StepPostRepostersQueryParamsCursor = StepPostRepostersQueryParams["cursor"] | undefined

/**
 * Represents a step for retrieving actors who reposted a post using the Bluesky API.
 * Supports paginated retrieval of reposters.
 *
 * @typeParam P - Type of the parent step, extending {@link StepPost}.
 * @typeParam C - Type of the context object, extending {@link StepPostOutput}.
 * @typeParam O - Type of the output object, extending {@link StepPostRepostersOutput}.
 *
 * @example
 * Get and iterate through users who reposted a post:
 * ```ts
 * await Trotsky.init(agent)
 *   .post("at://did:plc:example/app.bsky.feed.post/postid")
 *   .reposters()
 *   .each()
 *   .tap((step) => {
 *     console.log(`Reposted by: ${step.context.handle}`)
 *   })
 *   .run()
 * ```
 *
 * @example
 * Follow users who reposted a specific post:
 * ```ts
 * await Trotsky.init(agent)
 *   .post("at://did:plc:example/app.bsky.feed.post/postid")
 *   .reposters()
 *   .take(10)
 *   .each()
 *   .follow()
 *   .wait(2000)
 *   .run()
 * ```
 *
 * @public
 */
export class StepPostReposters<P = StepPost, C extends StepPostOutput = StepPostOutput, O extends StepPostRepostersOutput = StepPostRepostersOutput> extends StepActors<P, C, O> {

  /**
   * Applies pagination to retrieve reposters and sets the output.
   * Fetches paginated results using the agent and appends them to the output.
   */
  async applyPagination () {
    this.output = await this.paginate<O, AppBskyFeedGetRepostedBy.Response>("repostedBy", (cursor) => {
      return this.agent.app.bsky.feed.getRepostedBy(this.queryParams(cursor))
    })
  }

  /**
   * Generates query parameters for retrieving reposters, including the optional cursor.
   * @param cursor - The cursor for paginated queries.
   * @returns The query parameters for retrieving reposters.
   * @throws Error if no context is found.
   */
  private queryParams (cursor: StepPostRepostersQueryParamsCursor): StepPostRepostersQueryParams {
    if (!this.context) {
      throw new Error("No context found for StepPostReposters")
    }

    return { "uri": this.context.uri, cursor }
  }
}
