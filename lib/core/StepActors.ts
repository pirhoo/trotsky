import { StepActorsEntry, StepList } from '../trotsky'

export class StepActors extends StepList {
  override _steps: StepActorsEntry<this>[] = []

  each(): StepActorsEntry<this> {
    return this.append(StepActorsEntry<this>)
  }

  async apply() {
    console.log('Get actors')
  }
}