import type { HeadersMap } from '@atproto/xrpc'
import { Step, StepListEach } from '../trotsky'


type ListOutputSchemaCursor = string | undefined
interface ListOutputSchema { cursor?: ListOutputSchemaCursor, hitsTotal?: number, [k: string]: unknown }
interface ListResponse { success: boolean, headers: HeadersMap, data: ListOutputSchema }

export class StepList extends Step { 
  protected _take = Infinity
  protected _skip = 0

  take(take: number) {
    this._take = take
    return this
  }

  skip(skip: number) {
    this._skip = skip
    return this
  }

  each(): StepListEach<this> {
    return this.append(StepListEach<this>)
  }

  async iterator<T, R extends ListResponse>(attribute: string, fn: (cursor: ListOutputSchemaCursor) => Promise<R>): Promise<T> {
    let records = []
    let cursor: ListOutputSchemaCursor

    do {
      const { data } = await fn(cursor)
      cursor = data.cursor
      records = [...records, ...data[attribute] as []]
    } while(cursor && records.length < this._skip + this._take)

    return records.slice(this._skip, this._skip + this._take) as T
  }
}