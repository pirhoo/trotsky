import { Step } from '../trotsky'

export class StepWait extends Step {
  protected _duration: number

  constructor(agent, parent, duration = 0) {
    super(agent, parent)
    this._duration = duration
  } 

  async apply() {
    await new Promise(resolve => setTimeout(resolve, this._duration))
  }
}