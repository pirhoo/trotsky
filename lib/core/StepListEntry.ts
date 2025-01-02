import { Step, StepList } from '../trotsky'


export class StepListEntry<Parent extends StepList> extends Step {  
  constructor(agent, parent) {
    super(agent, parent as Parent)
  }

  async apply() {
    throw new Error('`apply` method not implemented.')
  }
}
