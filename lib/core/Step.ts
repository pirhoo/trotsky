import type AtpAgent from "@atproto/api"
import { StepBuilder, StepBuilderList, StepTap, StepTapInterceptor, StepWait, StepWhen, StepWhenPredicate, type StepBuilderConfig } from "../trotsky"
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
   * Retreive the configuration value for a given key on the current 
   * step or inherite the value from the parent step.
   * @param key - The configuration key.
   * @returns The configuration value.
   */
  config (key: string): unknown

  /**
   * Updates the configuration value for a given key on the current step.
   * @param key - The configuration key.
   * @param value - The new value.
   * @returns The current {@link Step} instance.
   */
  config (key: string, value: unknown): this

  /**
   * Updates the configuration object on the current step.
   * @param config - The new configuration object.
   * @returns The current {@link Step} instance.
   */
  config (config: StepBuilderConfig): this

  /**
   * Retrieves or updates the configuration value for a given key.
   * @param keyOrconfig - The configuration key or object.
   * @param value - The new value.
   * @returns The current {@link Step} instance if updating, or the configuration value if retrieving.
   * @remarks If the first argument is an object, it will be merged with the existing configuration.
   */
  config (keyOrconfig: string | StepBuilderConfig, value?: unknown): this | unknown {

    if (keyOrconfig instanceof Object) {
      return super.config(keyOrconfig)
    }

    if (value !== undefined) {
      return super.config(keyOrconfig, value)
    }

    return this._config[keyOrconfig] ?? (<Step> this.back()).config(keyOrconfig)
  }

  /**
   * Clones the current step and returns a new instance with the same parameters.
   * @param rest - Additional parameters to pass to the constructor.
   * @returns A new {@link StepActor} instance.
   */
  override clone (...rest: unknown[]) {
    return super.clone(this._parent, ...rest)
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
   * Checks if this instance is part of a {@link StepBuilderList}.
   */
  get isStepBuilderListEntry (): boolean {
    return this._parent instanceof StepBuilderList
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