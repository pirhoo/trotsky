import { Step } from '../trotsky'


export class StepListEachEntry extends Step {
  async apply() {
    console.log('Iterate over list entry')
  }
}
