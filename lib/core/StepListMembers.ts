import { AppBskyActorDefs, AppBskyGraphGetList } from "@atproto/api"
import { StepActors, StepList, StepListOutput } from "../trotsky"

/**
 * Represents the output type for the {@link StepListMembers} step, which is an array of actor profiles.
 * @public
 */
export type StepListMembersOutput = AppBskyActorDefs.ProfileView[]

/**
 * Represents the query parameters for retrieving a list's members.
 * @public
 */
export type StepListMembersQueryParams = AppBskyGraphGetList.QueryParams

/**
 * Represents the cursor type for paginated queries when retrieving list members.
 * @public
 */
export type StepListMembersQueryParamsCursor = StepListMembersQueryParams["cursor"] | undefined

/**
 * Represents step for retrieving the members of a specific list, extending the {@link StepActors} functionality.
 *
 * @typeParam P - The parent step type, defaulting to {@link StepList}.
 * @typeParam C - The context type, defaulting to {@link StepListOutput}.
 * @typeParam O - The output type, defaulting to {@link StepListMembersOutput}.
 *
 * @example
 * Get and display all members of a list:
 * ```ts
 * await Trotsky.init(agent)
 *   .list("at://did:plc:example/app.bsky.graph.list/listid")
 *   .members()
 *   .each()
 *   .tap((step) => {
 *     console.log(`${step.context.handle} - ${step.context.displayName}`)
 *   })
 *   .run()
 * ```
 *
 * @example
 * Follow all members of a list:
 * ```ts
 * await Trotsky.init(agent)
 *   .list("at://did:plc:example/app.bsky.graph.list/listid")
 *   .members()
 *   .each()
 *   .follow()
 *   .wait(2000)
 *   .run()
 * ```
 *
 * @public
 */
export class StepListMembers<P = StepList, C extends StepListOutput = StepListOutput, O extends StepListMembersOutput = StepListMembersOutput> extends StepActors<P, C, O> {

  /**
   * Applies pagination to retrieve all members of the list, handling multiple pages of results if necessary.
   * 
   * @returns A promise that resolves when pagination is complete.
   */
  async applyPagination (): Promise<void> {
    const items = await this.paginate<AppBskyGraphGetList.OutputSchema["items"], AppBskyGraphGetList.Response>("items", (cursor) => {
      return this.agent.app.bsky.graph.getList(this.queryParams(cursor))
    })

    this.output = items.map((item) => item.subject) as O
  }

  /**
   * Generates query parameters for retrieving a list and its members, including the optional cursor.
   * 
   * @param cursor - The cursor for paginated queries.
   * @returns The query parameters for retrieving the list.
   * @throws Error if no context is found.
   */
  private queryParams (cursor: StepListMembersQueryParamsCursor): StepListMembersQueryParams {
    if (!this.context) {
      throw new Error("No context found for StepListMembers")
    }

    return { "list": this.context.uri, cursor }
  }
}
