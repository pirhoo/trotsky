import { type AtpAgent } from "@atproto/api"
import { Step, StepStreamEntry, type ParentConstraint } from "../trotsky"
import { type JetstreamMessage, type JetstreamMessageCommit, type JetstreamEventEmitter } from "./utils/jetstream"

export abstract class StepStream<P = ParentConstraint, C = unknown, O = JetstreamMessage> extends Step<P, C, O> {
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
    return new Promise((resolve, reject) => {
      // Get the event emitter that is defined in the child class
      this.eventEmitter
        .on("error", reject)         
        .on("message", this.onMessage.bind(this))
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