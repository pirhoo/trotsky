import type AtpAgent from "@atproto/api"
import cron from "node-cron"

import Trotsky, { Step } from "../trotsky"

/**
 * Represents the configuration object for a {@link StepBuilder} instance.
 * @public
 */
export type StepBuilderConfig = object

/**
 * Represents a builder for a sequence of steps. This class is used internally by the {@link Trotsky} framework. 
 */
export abstract class StepBuilder {

  /** @internal */
  _agent: AtpAgent

  /** @internal */
  _steps: Step<this>[] = []

  /** @internal */
  _config: StepBuilderConfig = {}

  /**
   * Initializes a new {@link StepBuilder} instance.
   * @param agent - The {@link AtpAgent} instance for API interactions.
   */
  constructor (agent: AtpAgent) {
    this._agent = agent
  }

  /**
   * Updates the agent instance.
   * @param agent - The new {@link AtpAgent} instance.
   * 
   * @returns The current {@link Trotsky} instance.
   */
  withAgent (agent: AtpAgent) {
    this._agent = agent
    return this
  }

  /**
   * Retreive the configuration value for a given key.
   * @param key - The configuration key.
   * @returns The configuration value.
   */
  config (key: string): unknown

  /**
   * Updates the configuration value for a given key.
   * @param key - The configuration key.
   * @param value - The new value.
   * @returns The current {@link StepBuilder} instance.
   */
  config (key: string, value: unknown): this

  /**
   * Updates the configuration object.
   * @param config - The new configuration object.
   * @returns The current {@link StepBuilder} instance.
   */
  config (config: StepBuilderConfig): this

  /**
   * Retrieves or updates the configuration value for a given key.
   * @param keyOrconfig - The configuration key or object.
   * @param value - The new value.
   * @returns The current {@link StepBuilder} instance if updating, or the configuration value if retrieving.
   * @remarks If the first argument is an object, it will be merged with the existing configuration.
   */
  config (keyOrconfig: string | StepBuilderConfig, value?: unknown): this | unknown {

    if (keyOrconfig instanceof Object) {
      this._config = { ...this._config, ...keyOrconfig } 
      return this
    }

    if (value !== undefined) {
      this._config[keyOrconfig] = value
      return this
    }

    return this._config[keyOrconfig]
  }

  /**
   * Clones the current instance, including all steps and configuration.
   * 
   * @param rest - Additional arguments to pass to the constructor.
   * @returns A new instance of the current class.
   */
  clone (...rest: unknown[]): this {
    // First, clone the instance
    type Constructor<T> = new (...args: unknown[]) => T
    const Constructor = this.constructor as Constructor<this>
    const clone = new Constructor(this.agent, ...rest) as this
    // Then, clone the child steps
    for (const step of this.steps) {
      // When cloning the child step, we must also set its parent
      // or its going to use the original parent of the step.
      clone.push(step.clone().withParent(clone) as Step<this>)
    }
    // Finally, clone the config (and return the new instance)
    return clone.config({ ...this._config })
  }

  /**
   * Clears all steps from the sequence.
   * @returns The current {@link StepBuilder} instance.
   */
  clear () {
    this._steps = []
    return this
  }

  /**
   * Appends a new step to the sequence.
   * @param type - The step class.
   * @param args - Arguments for the step.
   * @returns The new step instance.
   */
  append<Type extends Step<this>>(type: new (agent: AtpAgent, parent: this, ...args) => Type, ...args: unknown[]): Type {
    const step = new type(this.agent, this, ...args)
    this.push(step)
    return step
  }

  /**
   * Adds a step to the sequence.
   * @param stepOrIndex - The step instance or index to remove.
   * @returns The current {@link StepBuilder} instance.
   */
  slice (stepOrIndex: Step<this> | number) {
    this._steps = this._steps.filter((step, index) => {
      return stepOrIndex instanceof Step ? step !== stepOrIndex : index !== stepOrIndex
    })
    return this
  }

  /**
   * Pushes a step to the sequence.
   * @param step - The step instance.
   * @returns The current {@link StepBuilder} instance.
   */
  push (...steps: Step<this>[]) {
    for (const step of steps) {
      this._steps.push(step)
    }
    return this
  }

  /**
   * Runs the sequence of steps, returning the top-level {@link StepBuilder} instance.
   */
  async run () {
    if (this.isTrotsky) {
      return this.runAll()
    } 
    // If the current instance is not a top-level Trotsky instance, 
    // we assume it's a nested Step instance and run the sequence from the top.
    return (this as unknown as Step).end().run()
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
   * Schedules the sequence to run at a given interval.
   * @param expression - The cron {@link https://github.com/kelektiv/node-cron | expression} defining the schedule.
   * @returns A cron job instance.
   */
  schedule (expression: string) {
    return cron.schedule(expression, this.run.bind(this))
  }

  /**
   * Applies all steps in the sequence.
   */
  async applyAll () {
    for (const step of this.steps) {
      await step.apply()
      // Skip the rest of the steps if the current step is a StepWhen and its output is falsy
      if (step.isStepWhen && !step.output) break

      if (!step.isStepBuilderListEntry) {
        await step.applyAll()
      }
    }
  }

  /**
   * Checks if this is a top-level {@link Trotsky} instance.
   */
  get isTrotsky (): boolean {
    return Object.getPrototypeOf(this) === Trotsky.prototype
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
}