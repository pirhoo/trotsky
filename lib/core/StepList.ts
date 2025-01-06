import type { AtpAgent } from "@atproto/api"
import type { HeadersMap } from "@atproto/xrpc"

import type { Resolvable } from "./utils/resolvable"
import { resolveValue } from "./utils/resolvable"
import { Step, StepListEntry, type StepBuilder } from "../trotsky"

/**
 * Represents the cursor for pagination in a list schema.
 * @public
 */
type StepListOutputSchemaCursor = string | undefined

/**
 * Interface defining the schema for a paginated list output.
 * @public
 */
interface StepListOutputSchema {
  "cursor"?: StepListOutputSchemaCursor;
  "hitsTotal"?: number;
  [k: string]: unknown;
}

/**
 * Interface representing the structure of a paginated response.
 * @public
 */
interface StepListResponse {
  "success": boolean;
  "headers": HeadersMap;
  "data": StepListOutputSchema;
}

/**
 * Represents the output of a list step as an array of items.
 * @public
 */
export type StepListOutput = unknown[]

/**
 * Abstract class representing a step that processes paginated lists.
 * 
 * @typeParam P - The parent type of the step, defaulting to {@link StepBuilder}.
 * @typeParam C - The child context type, defaulting to `unknown`.
 * @typeParam O - The output type of the step, defaulting to {@link StepListOutput}.
 * @public
 */
export abstract class StepList<P = StepBuilder, C = unknown, O extends StepListOutput = StepListOutput> extends Step<P, C, O> { 

  /**
   * Holds the list of steps to be executed for each entry in the list.
   */
  _steps: StepListEntry<this>[]

  /**
   * Number of items to take from the list. Defaults to `Infinity`.
   */
  _take: Resolvable<number> = Infinity

  /**
   * Number of items to skip from the start of the list. Defaults to `0`.
   */
  _skip: Resolvable<number> = 0

  /**
   * Initializes the StepList with the provided agent and parent step.
   * 
   * @param agent - The AT protocol agent used for API calls.
   * @param parent - The parent step in the chain.
   */
  constructor (agent: AtpAgent, parent: P) {
    super(agent, parent)
    this._steps = [] as StepListEntry<this>[]
  }

  /**
   * Sets the number of items to take from the list.
   * 
   * @param take - The number of items to take, resolved at runtime if necessary.
   * @returns The current instance for method chaining.
   */
  take (take: Resolvable<number>) {
    this._take = take
    return this
  }

  /**
   * Sets the number of items to skip from the start of the list.
   * 
   * @param skip - The number of items to skip, resolved at runtime if necessary.
   * @returns The current instance for method chaining.
   */
  skip (skip: Resolvable<number>) {
    this._skip = skip
    return this
  }

  /**
   * Appends a new entry processing step to the list.
   * 
   * @returns The appended {@link StepListEntry} instance.
   */
  each () {
    return this.append(StepListEntry<this>)
  }

  /**
   * Applies the list processing logic, including pagination and execution of child steps for each item in the output.
   * 
   * @throws Error
   * If `applyPagination` is not implemented by a child class.
   */
  async apply () {
    await this.applyPagination()

    for (const context of this.output!) {
      for (const step of this.steps) {
        await step.withOutput(context).applyAll()
      }
    }
  }

  /**
   * Abstract method to handle pagination. Must be implemented by subclasses.
   */
  abstract applyPagination (): Promise<void>

  /**
   * Handles pagination logic for retrieving records, fetching items in batches until the desired size is reached.
   * 
   * @typeParam T - The type of the final output array.
   * @typeParam R - The response type of the API call.
   * 
   * @param attribute - The attribute containing the paginated records.
   * @param fn - The function to fetch paginated data, taking the current cursor as input.
   * @returns A promise that resolves to an array of items after applying skip and take logic.
   */
  async paginate<T, R extends StepListResponse>(attribute: string, fn: (cursor: StepListOutputSchemaCursor) => Promise<R>): Promise<T> {
    let records = []
    let cursor: StepListOutputSchemaCursor

    const skip = await resolveValue<number>(this, this._skip)
    const take = await resolveValue<number>(this, this._take)
    const size = skip + take

    do {
      const { data } = await fn(cursor)
      cursor = data.cursor
      records = [...records, ...data[attribute] as []]
    } while (cursor && records.length < size)

    return records.slice(skip, size) as T
  }
}
