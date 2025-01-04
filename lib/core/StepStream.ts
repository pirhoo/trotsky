import { Step, StepStreamEntry, type ParentConstraint } from "../trotsky"
import { type JetstreamMessage, type JetstreamEventEmitter } from "./utils/jetstream"

export abstract class StepStream<P = ParentConstraint, C = null, O = JetstreamMessage> extends Step<P, C, O> {
  abstract get eventEmitter (): JetstreamEventEmitter

  each () {
    return this.append(StepStreamEntry<this>)
  }

  async apply (): Promise<void> {
    return new Promise((resolve, reject) => {
      // Get the event emitter that is defined in the child class
      this.eventEmitter
        .on("error", reject)         
        .on("message", this.onMessage.bind(this))
    })
  }

  async onMessage (message: JetstreamMessage): Promise<void> {
    for (const step of this.steps) {
      await step.withContext(message).applyAll()
    }
  }
}