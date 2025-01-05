import type { StepActors } from "../trotsky"
import { ActorMixins } from "./mixins/ActorMixins"

export class StepActorsEntry<P = StepActors, C = null, O = null> extends ActorMixins<P, C, O> { 
  async apply (): Promise<void> {
    this.output = null
  }
}