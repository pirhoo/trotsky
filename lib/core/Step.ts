import { ParentConstraint, Trotsky } from '../trotsky'

export abstract class Step<P = ParentConstraint, C = unknown, O = unknown>  extends Trotsky<P, C, O> {
  _parent: P

  constructor(agent, parent: P) {
    super(agent, parent)
    this._parent = parent
  }

  abstract apply(): Promise<void>

  back(): P {
    return this._parent as P
  }
}