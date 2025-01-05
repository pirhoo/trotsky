import type AtpAgent from "@atproto/api"
import { StepBuilder, StepList, StepTap, StepTapInterceptor, StepWait, StepWhen, StepWhenPredicate } from "../trotsky"
import { Resolvable } from "./utils/resolvable"

/**
 * Represents an abstract step in a sequence managed by the {@link Trotsky} framework.
 * @typeParam P - Type of the parent object.
 * @typeParam C - Type of the context object.
 * @typeParam O - Type of the output object.
 * @public
 */
export abstract class Step<P = StepBuilder, C = unknown, O = unknown> extends StepBuilder {

  /** @internal */
  _parent: P

  /** @internal */
  _context: C | null = null

  /** @internal */
  _output: O | null = null

  constructor (agent: AtpAgent, parent: P) {
    super(agent)
    this._parent = parent
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
   * Adds a {@link StepWait} step.
   * @param duration - The duration to wait, in milliseconds.
   * @returns The current {@link Step} instance.
   */
  wait (duration = 0) {
    this.append(StepWait<this>, duration)
    return this
  }

  /**
   *Adds a {@link StepWhen} step.
    * @param predicate - The predicate function.
    * @returns The current {@link Step} instance.
    */
  when (predicate: Resolvable<StepWhenPredicate>) {
    this.append(StepWhen<this>, predicate)
    return this
  }

  /**
   * Adds a {@link StepTap} step.
   * @returns The current {@link Step} instance.
   */
  tap (interceptor: StepTapInterceptor) {
    this.append(StepTap<this>, interceptor)
    return this
  }


  /**
   * Retrieves the parent object of this instance.
   * @returns The parent object.
   */
  back (): P {
    return this._parent as P
  }

  /**
   * Ends the sequence of steps.
   * @returns The top-level {@link Trotsky} instance.
   */
  end (): StepBuilder {
    if (this.isTrotsky) {
      return this
    }

    if ((this.back() as StepBuilder).isTrotsky) {
      return this.back() as StepBuilder
    }

    return (this.back() as unknown as Step).end()
  }

  /**
   * Abstract method that must be implemented by subclasses to define the behavior of the step.
   * @returns A promise that resolves when the step is applied.
   */
  abstract apply (): Promise<void>

  /**
   * Runs all steps in the sequence and returns the current {@link Step} instance.
   */
  async runHere () {
    await this.run()
    return this
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
   * Retrieves or sets the current context.
   */
  get context () {
    return this._context ?? (this.back() as Step)?.output as C
  }

  set context (value: C) {
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
}