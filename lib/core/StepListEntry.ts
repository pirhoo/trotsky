import type { StepList } from "../trotsky"
import { Step } from "../trotsky"


export abstract class StepListEntry<P = StepList, C = unknown, O = unknown> extends Step<P, C, O> { }
