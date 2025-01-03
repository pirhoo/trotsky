import type { AtpAgent } from "@atproto/api"
import { ParentConstraint, Trotsky } from "../trotsky"

export abstract class Step<P = ParentConstraint, C = unknown, O = unknown>  extends Trotsky<P, C, O> {
  _parent: P

  constructor (agent: AtpAgent, parent: P) {
    super(agent, parent)
    this._parent = parent
  }

  abstract apply (): Promise<void>
  back (): P {
    return this._parent
  }
}