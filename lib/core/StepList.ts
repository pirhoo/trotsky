import type { AtpAgent } from "@atproto/api"
import type { HeadersMap } from "@atproto/xrpc"

import type { Resolvable } from "./utils/resolvable"
import { resolveValue } from "./utils/resolvable"
import { Step, StepListEntry, type ParentConstraint } from "../trotsky"

type ListOutputSchemaCursor = string | undefined
interface ListOutputSchema {
  "cursor"?: ListOutputSchemaCursor;
  "hitsTotal"?: number;
  [k: string]: unknown; 
}
interface ListResponse {
  "success": boolean;
  "headers": HeadersMap;
  "data": ListOutputSchema; 
}

export type StepListOutput = unknown[]

export abstract class StepList<P = ParentConstraint, C = unknown, O extends StepListOutput = StepListOutput> extends Step<P, C, O> { 
  _steps: StepListEntry<this>[]

  _context: C | null = null

  _output: O | null = null

  _take: Resolvable<number> = Infinity

  _skip: Resolvable<number> = 0

  constructor (agent: AtpAgent, parent: P) {
    super(agent, parent)
    this._steps = [] as StepListEntry<this>[]
  }

  take (take: Resolvable<number>) {
    this._take = take
    return this
  }

  skip (skip: Resolvable<number>) {
    this._skip = skip
    return this
  }

  each () {
    return this.append(StepListEntry<this>)
  }

  async apply () {
    await this.applyPagination()

    for (const context of this.output!) {
      for (const step of this.steps) {
        // Use current context as output for each child step
        await step.withOutput(context).applyAll()
      }
    }
  }

  // StepList child must define a `applyPagination` method
  abstract applyPagination (): Promise<void>

   
  async paginate<T, R extends ListResponse>(attribute: string, fn: (cursor: ListOutputSchemaCursor) => Promise<R>): Promise<T> {
    let records = []
    let cursor: ListOutputSchemaCursor

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