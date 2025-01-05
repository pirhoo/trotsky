import { type AtpAgent } from "@atproto/api"

import { Step, StepStreamEntry, type StepBuilder } from "../trotsky"
import { type JetstreamMessage, type JetstreamMessageCommit, type JetstreamEventEmitter } from "./utils/jetstream"

export abstract class StepStream<P = StepBuilder, C = unknown, O = JetstreamMessage> extends Step<P, C, O> {
  _steps: StepStreamEntry<this>[]


  constructor (agent: AtpAgent, parent: P) {
    super(agent, parent)
    this._steps = [] as StepStreamEntry<this>[]
  }
  
  each () {
    return this.append(StepStreamEntry<this>)
  }

  abstract get eventEmitter (): JetstreamEventEmitter

  async resolveOutput (message: JetstreamMessage): Promise<O> {
    return message as O
  }

  async apply (): Promise<void> {
    // PQueue is a CommonJS module whose imports will produce 'require' calls; however, this 
    // file is an ECMAScript module and cannot be imported with 'require'.
    const { "default": PQueue } = await import("p-queue")

    return new Promise((_resolve, reject) => {
      // We use a queue to ensure that we process messages sequentially
      const queue = new PQueue()
      // Get the event emitter that is defined in the child class
      this.eventEmitter
        .on("error", reject)         
        .on("message", async (message) => {
          try {
            await queue.add(() => this.onMessage(message))
          // Any error that occurs during the processing of a message by child steps will 
          // be caught here and will cause a rejection of the promise.
          } catch (error) {
            reject(error)
          }
        })
    })
  }

  async onMessage (message: JetstreamMessage): Promise<void> {
    // We currently restruct support for only commit events with create operations
    if ((<JetstreamMessageCommit>message)?.commit?.operation === "create") {
      for (const step of this.steps) {
        const record = await this.resolveOutput(message)
        await step.withOutput(record).applyAll()
      }
    }
  }
}