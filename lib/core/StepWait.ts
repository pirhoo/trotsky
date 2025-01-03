import { Step, type ParentConstraint } from '../trotsky'

export class StepWait<P = ParentConstraint, C = null, O = null> extends Step<P, C, O> {
  protected _duration: number

  constructor(agent, parent, duration = 0) {
    super(agent, parent)
    this._duration = duration
  } 

  async apply() {
    await new Promise(resolve => setTimeout(resolve, this._duration))
  }
}