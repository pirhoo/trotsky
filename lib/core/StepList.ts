import type { HeadersMap } from '@atproto/xrpc'

import type { Resolvable } from './utils/resolvable'
import { resolveValue } from './utils/resolvable'
import { Step, StepListEach } from '../trotsky'

type ListOutputSchemaCursor = string | undefined
interface ListOutputSchema { cursor?: ListOutputSchemaCursor, hitsTotal?: number, [k: string]: unknown }
interface ListResponse { success: boolean, headers: HeadersMap, data: ListOutputSchema }

export class StepList extends Step { 
  protected _take: Resolvable<number> = Infinity
  protected _skip: Resolvable<number> = 0

  take(take: Resolvable<number>) {
    this._take = take
    return this
  }

  skip(skip: Resolvable<number>) {
    this._skip = skip
    return this
  }

  each(): StepListEach<this> {
    return this.append(StepListEach<this>)
  }

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