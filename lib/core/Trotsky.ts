import type { AtpAgent } from "@atproto/api"
import type { QueryParams } from "@atproto/api/src/client/types/app/bsky/feed/searchPosts"

import type { Step } from "../trotsky"
import type { StepActorParam } from "./StepActor"
import type { StepPostUri } from "./StepPost"
import type { StepCreatePostParams } from "./StepCreatePost"
import type { StepWhenPredicate } from "./StepWhen"
import type { Resolvable } from "./utils/resolvable"

import { StepActor, StepWait, StepPost, StepCreatePost, StepSearchPosts, StepStreamPosts, StepList, StepWhen } from "../trotsky"

/**
 * Type constraints for generic parameters of the {@link Trotsky} class.
 */
export type ParentConstraint = unknown
export type ContextConstraint = null
export type OutputConstraint = null

/**
 * Trotsky orchestrates a sequence of steps that interact with an {@link AtpAgent}.
 * @typeParam P - Type of the parent object.
 * @typeParam C - Type of the context object.
 * @typeParam O - Type of the output object.
 * @public
 */
export class Trotsky<P = ParentConstraint, C = ContextConstraint, O = OutputConstraint> {

  /** @internal */
  _agent: AtpAgent

  /** @internal */
  _steps: Step<this>[] = []

  /** @internal */
  _parent: P | null = null

  /** @internal */
  _context: C | null = null

  /** @internal */
  _output: O | null = null

  /**
   * Initializes a new {@link Trotsky} instance.
   * @param agent - The {@link AtpAgent} instance for API interactions.
   * @param parent - Optional parent object.
   */
  constructor (agent: AtpAgent, parent?: P) {
    this._agent = agent
    this._parent = parent ?? null
  }

  /**
   * Updates the agent instance.
   * @param agent - The new {@link AtpAgent} instance.
   * @returns The current {@link Trotsky} instance.
   */
  withAgent (agent: AtpAgent) {
    this._agent = agent
    return this
  }

  /**
   * Sets the context.
   * @param context - The context object.
   * @returns The current {@link Trotsky} instance.
   */
  withContext (context: C) {
    this._context = context
    return this
  }

  /**
   * Sets the output.
   * @param output - The output object.
   * @returns The current {@link Trotsky} instance.
   */
  withOutput (output: O) {
    this._output = output
    return this
  }

  /**
   * Adds a {@link StepActor} step.
   * @param param - Parameters for the actor step.
   * @returns The new {@link StepActor} instance.
   */
  actor (param: Resolvable<StepActorParam>) {
    const step = new StepActor<this>(this.agent, this, param)
    this._steps.push(step)
    return step
  }

  /**
   * Adds a {@link StepPost} step.
   * @param uri - The post URI.
   * @returns The new {@link StepPost} instance.
   */
  post (uri: Resolvable<StepPostUri>) {
    const step = new StepPost<this>(this.agent, this, uri)
    this._steps.push(step)
    return step
  }

  /**
   * Adds a {@link StepCreatePost} step.
   * @param record - Parameters for creating a post.
   * @returns The new {@link StepCreatePost} instance.
   */
  createPost (record: StepCreatePostParams) {
    return this.append(StepCreatePost<this>, record)
  }

  /**
   * Adds a {@link StepSearchPosts} step.
   * @param queryParams - Search parameters.
   * @returns The new {@link StepSearchPosts} instance.
   */
  searchPosts (queryParams: QueryParams) {
    const step = new StepSearchPosts<this>(this.agent, this, queryParams)
    this._steps.push(step)
    return step
  }

  /**
   * Adds a {@link StepStreamPosts} step.
   * @returns The new {@link StepStreamPosts} instance.
   */
  streamPosts () {
    return this.append(StepStreamPosts<this>)
  }

  /**
   * Ends the sequence of steps.
   * @returns The top-level {@link Trotsky} instance.
   */
  end (): Trotsky {
    return this.isTrotsky ? (this as Trotsky) : (this.back() as Step).end()
  }

  /**
   * Retrieves the parent object.
   * @returns The parent object or `null` if none exists.
   */
  back (): P | null {
    return this._parent
  }

  /**
   * Appends a new step to the sequence.
   * @param type - The step class.
   * @param args - Arguments for the step.
   * @returns The new step instance.
   */
  append<Type extends Step<this>>(type: new (agent: AtpAgent, parent: this, ...args) => Type, ...args: unknown[]): Type {
    const step = new type(this.agent, this, ...args)
    this._steps.push(step)
    return step
  }

  /**
   * Adds a {@link StepWait} step.
   * @param duration - The duration to wait, in milliseconds.
   * @returns The current {@link Trotsky} instance.
   */
  wait (duration = 0) {
    return this.append(StepWait<this>, duration)
  }

  /**
   *Adds a {@link StepWhen} step.
   * @param predicate - The predicate function.
   * @returns The new {@link StepWhen} instance.
   */
  when (predicate: Resolvable<StepWhenPredicate>) {
    this.append(StepWhen<this>, predicate)
    return this
  }

  /**
   * Retrieves all steps in the sequence.
   */
  get steps (): Step[] {
    return this._steps as Step[]
  }

  /**
   * Retrieves a flattened list of all steps, including nested ones.
   */
  get flattenSteps (): Step[] {
    return this.steps.reduce((acc, step: Step) => {
      return [...acc, step, ...step.flattenSteps]
    }, [] as Step[])
  }

  /**
   * Retrieves the current {@link AtpAgent} instance.
   */
  get agent (): AtpAgent {
    return this._agent
  }

  /**
   * Retrieves or sets the current context.
   */
  get context () {
    return this._context ?? (this.back() as Trotsky)?.output
  }

  set context (value) {
    this._context = value
  }

  /**
   * Retrieves or sets the current output.
   */
  get output () {
    return this._output
  }

  set output (value) {
    this._output = value
  }

  /**
   * Checks if this is a top-level {@link Trotsky} instance.
   */
  get isTrotsky (): boolean {
    return Object.getPrototypeOf(this) === Trotsky.prototype
  }

  /**
   * Checks if this instance is part of a {@link StepList}.
   */
  get isStepListEntry (): boolean {
    return this._parent instanceof StepList
  }

  get isStepWhen (): boolean {
    return this instanceof StepWhen
  }

  /**
   * Applies all steps in the sequence.
   */
  async applyAll () {
    for (const step of this.steps) {
      await step.apply()
      // Skip the rest of the steps if the current step is a StepWhen its output is falsy
      if (step.isStepWhen && !step.output) break

      if (!step.isStepListEntry) {
        await step.applyAll()
      }
    }
  }

  /**
   * Runs all steps in the sequence.
   * @returns The current {@link Trotsky} instance.
   */
  async runAll () {
    await this.applyAll()
    return this
  }

  /**
   * Runs the sequence of steps, returning the top-level {@link Trotsky} instance.
   */
  async run () {
    return this.isTrotsky ? this.runAll() : (this.end().run() as Trotsky)
  }

  /**
   * Initializes a new {@link Trotsky} instance with the specified agent.
   * @param agent - The {@link AtpAgent} instance.
   * @returns A new {@link Trotsky} instance.
   */
  static init (agent: AtpAgent): Trotsky {
    return new Trotsky(agent)
  }
}
