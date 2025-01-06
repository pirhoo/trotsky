import { AppBskyGraphGetLists } from "@atproto/api"
import { StepLists, type StepActor, type StepListsOutput, type StepActorOutput } from "../trotsky"

/**
 * Represents the output type for the {@link StepActorLists} step, which is an array 
 * of lists associated with an actor.
 * 
 * @public
 */
export type StepActorListsOutput = StepListsOutput

/**
 * Represents the query parameters for retrieving an actor's lists.
 * 
 * @public
 */
export type StepActorListsQueryParams = AppBskyGraphGetLists.QueryParams

/**
 * Represents the cursor type for paginated queries when retrieving an actor's lists.
 * 
 * @public
 */
export type StepActorListsQueryParamsCursor = StepActorListsQueryParams["cursor"] | undefined

/**
 * A step that retrieves the lists associated with a specific actor, extending the {@link StepLists} functionality.
 * 
 * @typeParam P - The parent step type, defaulting to {@link StepActor}.
 * @typeParam C - The context type, defaulting to {@link StepActorOutput}.
 * @typeParam O - The output type, defaulting to {@link StepActorListsOutput}.
 * 
 * @public
 */
export class StepActorLists<P = StepActor, C extends StepActorOutput = StepActorOutput, O extends StepListsOutput = StepActorListsOutput> extends StepLists<P, C, O> {

  /**
   * Applies pagination to retrieve all lists associated with the actor, handling multiple pages of results if necessary.
   * 
   * @returns A promise that resolves when pagination is complete.
   */
  async applyPagination (): Promise<void> {
    this.output = await this.paginate<O, AppBskyGraphGetLists.Response>("lists", (cursor) => {
      return this.agent.app.bsky.graph.getLists(this.queryParams(cursor))
    })
  }

  /**
   * Generates query parameters for retrieving an actor's lists, including the optional cursor.
   * 
   * @param cursor - The cursor for paginated queries.
   * @returns The query parameters for retrieving the actor's lists.
   * @throws Error if no context is found.
   */
  queryParams (cursor: StepActorListsQueryParamsCursor): StepActorListsQueryParams {
    if (!this.context) {
      throw new Error("No context found for StepActorLists")
    }

    return { "actor": this.context.did, cursor }
  }
}
