import type{ AtpAgent } from "@atproto/api"

import { Step, type StepBuilder } from "../trotsky"

export class StepWait<P = StepBuilder, C = null, O = null> extends Step<P, C, O> {
  protected _duration: number

  constructor (agent: AtpAgent, parent: P, duration = 0) {
    super(agent, parent)
    this._duration = duration
  }

  async apply () {
    await new Promise(resolve => setTimeout(resolve, this._duration))
  }
}