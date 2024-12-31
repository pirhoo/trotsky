import type { AtpAgent } from '@atproto/api'
import type { QueryParams } from '@atproto/api/src/client/types/app/bsky/feed/searchPosts'
import type { Step } from '../trotsky'

import { StepActor, StepWait, StepSearchPosts } from '../trotsky'

export type ParentConstraint = Trotsky | null

export class Trotsky {
  _agent: AtpAgent
  _parent: ParentConstraint = null
  _steps: Step[] = []
  _context: unknown | null = null

  constructor(agent: AtpAgent, parent: ParentConstraint = null) {
    this._agent = agent
    this._parent = parent
  }

  actor(actor) {
    const step = new StepActor(this.agent, this, actor)
    this._steps.push(step)
    return step
  }

  searchPosts(queryParams: QueryParams) {
    const step = new StepSearchPosts(this.agent, this, queryParams)
    this._steps.push(step)
    return step
  }

  end(): Trotsky {
    return this.back()?.end() ?? this
  }

  back(): ParentConstraint {
    return this._parent
  }

  append<Type extends Step>(type: new(agent: AtpAgent, parent: this, ...args) => Type, ...args: unknown[]): Type {
    const step = new type(this.agent, this, ...args)
    this._steps.push(step)
    return step
  }

  wait(duration = 0) {
    this.append(StepWait, duration)
    return this
  }

  get steps(): Step[] {
    return this._steps.reduce((acc, step: Step) => {
      return [...acc, step]
    }, [] as Step[])
  }
  
  get flattenSteps(): Step[] {
    return this.steps.reduce((acc, step: Step) => {
      return [...acc, step, ...step.flattenSteps]
    }, [] as Step[])
  }

  get agent(): AtpAgent {
    return this._agent
  }

  get context() {
    return this._context ?? this.back()?.context
  }

  set context(value) {
    this._context = value
  }

  get ownContext() {
    return this._context
  }

  set ownContext(value) {
    this._context = value
  }

  async apply(): Promise<void> {
    throw new Error('Apply method not implemented')
  }

  async run() {
    if (Object.getPrototypeOf(this) !== Trotsky.prototype) {
      return this.end().run()
    }

    for (const step of this.flattenSteps) {
      await step.apply()
    }

    return this
  }

  static init(agent: AtpAgent): Trotsky {
    return new Trotsky(agent)
  }
}
