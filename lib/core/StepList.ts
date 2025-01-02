import type { HeadersMap } from '@atproto/xrpc'

import type { Resolvable } from './utils/resolvable'
import { resolveValue } from './utils/resolvable'
import { Step, StepListEntry } from '../trotsky'

type ListOutputSchemaCursor = string | undefined
interface ListOutputSchema { cursor?: ListOutputSchemaCursor, hitsTotal?: number, [k: string]: unknown }
interface ListResponse { success: boolean, headers: HeadersMap, data: ListOutputSchema }

export abstract class StepList extends Step { 
  _take: Resolvable<number> = Infinity
  _skip: Resolvable<number> = 0
  _steps: StepListEntry<this>[] = []
  _context: unknown[] = []

  take(take: Resolvable<number>) {
    this._take = take
    return this
  }

  skip(skip: Resolvable<number>) {
    this._skip = skip
    return this
  }

  each(): StepListEntry<this> {
    return this.append(StepListEntry<this>)
  }

  async apply() {
    await this.applyPagination()

    for (const context of this.context) {
      for (const step of this.steps) {
        step.context = context
        await step.applyAll()
      }
    }
  }

  // StepList child must define a `applyPagination` method
  abstract applyPagination(): Promise<void>

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
    } while(cursor && records.length < size)

    return records.slice(skip, size) as T
  }
}