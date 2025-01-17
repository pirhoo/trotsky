import type { HeadersMap } from "@atproto/xrpc"

import type { Resolvable } from "./utils/resolvable"
import { resolveValue } from "./utils/resolvable"
import { Step, StepBuilderListEntry, type StepBuilder } from "../trotsky"

/**
 * Represents the cursor for pagination in a list schema.
 * @public
 */
type StepBuilderListOutputSchemaCursor = string | undefined

/**
 * Interface defining the schema for a paginated list output.
 * @public
 */
interface StepBuilderListOutputSchema {
  "cursor"?: StepBuilderListOutputSchemaCursor;
  "hitsTotal"?: number;
  [k: string]: unknown;
}

/**
 * Interface representing the structure of a paginated response.
 * @public
 */
interface StepBuilderListResponse {
  "success": boolean;
  "headers": HeadersMap;
  "data": StepBuilderListOutputSchema;
}

/**
 * Represents the output of a list step as an array of items.
 * @public
 */
export type StepBuilderListOutput = unknown[]

/**
 * Iterator function to be executed for each item in the list.
 * @public
 */
export type StepBuilderListIterator = null | ((step: StepBuilderListEntry) => Promise<void> | void)

/**
 * Abstract class representing a step that processes paginated lists.
 * 
 * @typeParam P - The parent type of the step, defaulting to {@link StepBuilder}.
 * @typeParam C - The child context type, defaulting to `unknown`.
 * @typeParam O - The output type of the step, defaulting to {@link StepBuilderListOutput}.
 * @public
 */
export abstract class StepBuilderList<P = StepBuilder, C = unknown, O extends StepBuilderListOutput = StepBuilderListOutput> extends Step<P, C, O> { 

  /**
   * Holds the list of steps to be executed for each entry in the list.
   */
  _steps: StepBuilderListEntry<this>[] = [] as StepBuilderListEntry<this>[]

  /**
   * Number of items to take from the list. Defaults to `Infinity`.
   */
  _take: Resolvable<number> = Infinity

  /**
   * Number of items to skip from the start of the list. Defaults to `0`.
   */
  _skip: Resolvable<number> = 0

  /**
   * Optional tterator function to be executed for each item in the list.
   */
  _iterator?: StepBuilderListIterator

  /**
   * Clones the current step and returns a new instance with the same parameters.
   * @param rest - Additional parameters to pass to the cloned step. This is useful for child class overriding the clone.
   * @returns A new {@link StepActor} instance.
   */
  override clone (...rest: unknown[]) {
    return super
      .clone(...rest)
      .skip(this._skip)
      .take(this._take)
      .withIterator(this._iterator)
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
   * Sets the iterator function to be executed for each item in the list.
   * 
   * @param iterator - The iterator function to be executed.
   * @returns The current instance for method chaining.
   */
  withIterator (iterator?: StepBuilderListIterator) {
    if (iterator) {
      this._iterator = iterator
    }

    return this
  }

  /**
   * Appends a new entry processing step to the list.
   * 
   * @param iterator - Optional iterator function to be executed for each item in the list.
   * @returns The appended {@link StepBuilderListEntry} instance.
   */
  each (iterator?: StepBuilderListIterator) {
    return this.withIterator(iterator).append(StepBuilderListEntry<this>)
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
        // We might have an iterator function to be executed for each item in the list.
        // Iterator can be used to created nested steps for each item in the list so it's
        // important they receive a cloned step entry that is not going to interfere with
        // the parent step's context or the siblings steps.
        if (this._iterator) {
          // Create a clone of the top-level step to avoid modifying the original instance
          // and clear its steps to avoid executing child steps over and over again.
          const stepLessParent = this.end().clone().clear()
          const childLessClone = step.clone().clear()
          // Set the relationship between the parent and child steps.
          stepLessParent.push(childLessClone)
          childLessClone.withParent(stepLessParent)
          // Execute the iterator function for each item in the list. As you can see
          // the context of the parent step is passed to the child step as output.
          await this._iterator(childLessClone.withOutput(context as O[number]) as StepBuilderListEntry)
        }
        
        await step.withOutput(context as O[number]).applyAll()
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
  async paginate<T, R extends StepBuilderListResponse>(attribute: string, fn: (cursor: StepBuilderListOutputSchemaCursor) => Promise<R>): Promise<T> {
    let records = []
    let cursor: StepBuilderListOutputSchemaCursor

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
