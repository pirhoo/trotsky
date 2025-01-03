import type { AtpAgent } from "@atproto/api"
import type { QueryParams } from "@atproto/api/src/client/types/app/bsky/feed/searchPosts"

import type { Step } from "../trotsky"
import type { StepActorParam } from "./StepActor"
import type { StepPostUri } from "./StepPost"
import type { Resolvable } from "./utils/resolvable"

import { StepActor, StepWait, StepPost, StepSearchPosts, StepList } from "../trotsky"

export type ParentConstraint = unknown
export type ContextConstraint = null
export type OutputConstraint = null

export class Trotsky<P = ParentConstraint, C = ContextConstraint, O = OutputConstraint> {
  _agent: AtpAgent

  _steps: Step<this>[] = []

  _parent: P | null = null

  _context: C | null = null

  _output: O | null = null

  constructor (agent: AtpAgent, parent?: P) {
    this._agent = agent
    this._parent = parent ?? null
  }

  withAgent (agent: AtpAgent) {
    this._agent = agent
    return this
  }

  withContext (context: C) {
    this._context = context
    return this
  }

  actor (param: Resolvable<StepActorParam>) {
    const step = new StepActor<this>(this.agent, this, param)
    this._steps.push(step)
    return step
  }

  post (uri: Resolvable<StepPostUri>) {
    const step = new StepPost<this>(this.agent, this, uri)
    this._steps.push(step)
    return step
  }

  searchPosts (queryParams: QueryParams) {
    const step = new StepSearchPosts<this>(this.agent, this, queryParams)
    this._steps.push(step)
    return step
  }

  end (): Trotsky {
    return this.isTrotsky ? this as Trotsky : (this.back() as Step).end()
  }

  back (): P | null {
    return this._parent
  }

   
  append<Type extends Step<this>>(type: new(agent: AtpAgent, parent: this, ...args) => Type, ...args: unknown[]): Type {
    const step = new type(this.agent, this, ...args)
    this._steps.push(step)
    return step
  }

  wait (duration = 0) {
    this.append(StepWait<this>, duration)
    return this
  }

  get steps (): Step[] {
    return this._steps as Step[]
  }

  get flattenSteps (): Step[] {
    return this.steps.reduce((acc, step: Step) => {
      return [...acc, step, ...step.flattenSteps]
    }, [] as Step[])
  }

  get agent (): AtpAgent {
    return this._agent
  }

  get context () {
    return this._context ?? (this.back() as Trotsky)?.output
  }

  set context (value) {
    this._context = value
  }

  get output () {
    return this._output
  }

  set output (value) {
    this._output = value
  }

  get isTrotsky (): boolean {
    return Object.getPrototypeOf(this) === Trotsky.prototype
  }

  get isStepListEntry (): boolean {
    return this._parent instanceof StepList
  }

  async applyAll () {
    for (const step of this.steps) {
      await step.apply()

      if (!step.isStepListEntry) {
        await step.applyAll()
      }
    }
  }

  async runAll () {
    await this.applyAll()
    return this
  }

  async run () {
    return this.isTrotsky ? this.runAll() : this.end().run() as Trotsky
  }

  static init (agent: AtpAgent): Trotsky {
    return new Trotsky(agent)
  }
}
