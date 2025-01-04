import { Step, type StepPost, type StepPostOutput } from "../trotsky"

export interface StepPostLikeRecordRef {
  "uri": string;
  "cid": string;  
}

export type StepPostLikeOutput = StepPostLikeRecordRef

export class StepPostLike<P = StepPost, C extends StepPostOutput = StepPostOutput, O extends StepPostLikeOutput = StepPostLikeOutput> extends Step<P, C, O> {
  async apply () {
    const { uri, cid } = this.context as C
    this.output = await this.agent.like(uri, cid) as O
  }
}
