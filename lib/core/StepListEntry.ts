import type { StepList } from '../trotsky'
import { Step } from '../trotsky'


export class StepListEntry<P = StepList, C = unknown, O = unknown> extends Step<P, C, O> {  
  async apply() {
    throw new Error('`apply` method not implemented.')
  }
}
