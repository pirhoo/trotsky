import type { StepActors } from '../trotsky'
import { ActorMixins } from './mixins/ActorMixins'

export class StepActorsEntry<P = StepActors, C = null, O = null> extends ActorMixins<P, C, O> {
  back() {
    return super.back() as P
  }

  async apply() {
    throw new Error('`apply` method not implemented.')
  }
}