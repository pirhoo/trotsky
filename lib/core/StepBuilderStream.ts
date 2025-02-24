import { type AtpAgent } from "@atproto/api"

import { Step, StepBuilderStreamEntry, type StepBuilder } from "../trotsky"
import { type JetstreamMessage, type JetstreamMessageCommit, type JetstreamEventEmitter } from "./utils/jetstream"

/**
 * @experimental
 * 
 * Abstract class representing a step for streaming messages using a Jetstream event emitter.
 * 
 * @typeParam P - The parent type of this step, defaulting to {@link StepBuilder}.
 * @typeParam C - The context type, defaulting to `unknown`.
 * @typeParam O - The output type, defaulting to {@link JetstreamMessage}.
 * @public
 */
export abstract class StepBuilderStream<P = StepBuilder, C = unknown, O = JetstreamMessage> extends Step<P, C, O> {

  /**
   * Holds the list of steps to be executed for each streamed entry.
   */
  _steps: StepBuilderStreamEntry<this>[]

  /**
   * Initializes the StepBuilderStream instance with the given agent and parent step.
   * 
   * @param agent - The AT protocol agent used for API calls.
   * @param parent - The parent step in the chain.
   */
  constructor (agent: AtpAgent, parent: P) {
    super(agent, parent)
    this._steps = [] as StepBuilderStreamEntry<this>[]
  }
  
  /**
   * Appends a new stream entry step to the current list and returns it.
   * 
   * @returns The newly appended {@link StepBuilderStreamEntry} instance.
   */
  each () {
    return this.append(StepBuilderStreamEntry<this>)
  }

  /**
   * Build the Jetstream event emitter. Must be implemented by subclasses.
   * 
   * @returns A promise resolving to the Jetstream event emitter.
   */
  abstract buildEventEmitter (): Promise<JetstreamEventEmitter>

  /**
   * Resolves the output of the current step from the given message.
   * 
   * @param message - The incoming Jetstream message.
   * @returns A promise resolving to the step's output.
   */
  async resolveOutput (message: JetstreamMessage): Promise<O> {
    return message as O
  }

  /**
   * Applies the stream logic by listening to events from the event emitter and processing them sequentially.
   * Messages are handled using a queue to ensure sequential execution.
   * 
   * @override
   * @returns A promise that resolves when the stream processing is complete or rejects on error.
   */
  async apply (): Promise<void> {
    const { "default": PQueue } = await import("p-queue")
    const eventEmitter = await this.buildEventEmitter()

    return new Promise((_resolve, reject) => {
      // Create a queue to ensure sequential message processing
      const queue = new PQueue()
      
      // Listen to events from the event emitter
      eventEmitter
        .on("error", reject)         
        .on("message", async (message) => {
          try {
            await queue.add(() => this.onMessage(message))
          } catch (error) {
            reject(error) // Reject if any step fails
          }
        })
    })
  }

  /**
   * Processes a Jetstream message by executing child steps for valid commit events.
   * 
   * @param message - The incoming Jetstream message.
   * @returns A promise that resolves when the message has been processed.
   */
  async onMessage (message: JetstreamMessage): Promise<void> {
    // Handle only commit events with "create" operations
    if ((<JetstreamMessageCommit>message)?.commit?.operation === "create") {
      for (const step of this.steps) {
        const record = await this.resolveOutput(message)
        // We clone the step to avoid modifying the original instance
        // so each step can have its own output context without
        // interfering with other steps.
        await step.clone().withOutput(record).applyAll()
      }
    }
  }
}
