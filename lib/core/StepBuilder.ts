import type AtpAgent from "@atproto/api"
import Trotsky, { Step } from "../trotsky"

/**
 * Represents a builder for a sequence of steps. This class is used internally by the {@link Trotsky} framework.
 * @private
 */
export class StepBuilder {

  /** @internal */
  _agent: AtpAgent

  /** @internal */
  _steps: Step<this>[] = []

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
   * @returns The current {@link Trotsky} instance.
   */
  withAgent (agent: AtpAgent) {
    this._agent = agent
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
    this._steps.push(step)
    return step
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
   * Applies all steps in the sequence.
   */
  async applyAll () {
    for (const step of this.steps) {
      await step.apply()
      // Skip the rest of the steps if the current step is a StepWhen and its output is falsy
      if (step.isStepWhen && !step.output) break

      if (!step.isStepListEntry) {
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