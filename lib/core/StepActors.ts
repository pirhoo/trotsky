import type { AppBskyActorGetProfiles } from "@atproto/api"

import { ParentConstraint, StepActorsEntry, StepList } from "../trotsky"


export type StepActorsOutput = AppBskyActorGetProfiles.OutputSchema["profiles"]

export abstract class StepActors<P = ParentConstraint, C = null, O extends StepActorsOutput = StepActorsOutput> extends StepList<P, C, O> {
  _steps: StepActorsEntry<this, null, null>[] = []

  each (): StepActorsEntry<this> {
    return this.append(StepActorsEntry<this>)
  }
}