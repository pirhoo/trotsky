import type { StepActors } from "../trotsky"
import { ActorMixins } from "./mixins/ActorMixins"

export class StepActorsEntry<P = StepActors, C = null, O = null> extends ActorMixins<P, C, O> { 
  apply (): never {
    throw new Error("Apply method not implemented.")
  }
}