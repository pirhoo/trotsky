import type { AppBskyActorGetProfiles } from '@atproto/api'

import { ParentConstraint, StepActorsEntry, StepList } from '../trotsky'


export type StepActorsOutput = AppBskyActorGetProfiles.OutputSchema['profiles']

export class StepActors<P = ParentConstraint, C = null, O extends StepActorsOutput = StepActorsOutput> extends StepList<P, C, O> {
  _steps: StepActorsEntry<this>[] = []

  each(): StepActorsEntry<this> {
    return this.append(StepActorsEntry<this>)
  }

  async applyPagination(): Promise<void> {
    throw new Error('`applyPagination` not implemented.')
  }
}