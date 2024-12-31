import type { StepList, StepListEachEntry }from '../trotsky'
import { Step } from '../trotsky'


export class StepListEach<Parent extends StepList> extends Step { 
  override _steps: StepListEachEntry[]

  constructor(agent, parent) {
    super(agent, parent)
    this._steps = [] as StepListEachEntry[]
  }

  back() {
    return super.back() as Parent
  }
}