import { StepActorsEntry, StepList } from '../trotsky'

export class StepActors extends StepList {
  _steps: StepActorsEntry<this>[] = []

  each(): StepActorsEntry<this> {
    return this.append(StepActorsEntry<this>)
  }

  async applyPagination(): Promise<void> {
    throw new Error('`applyPagination` not implemented.')
  }
}