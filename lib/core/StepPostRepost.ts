import { Step, type StepPost, type StepPostOutput } from "../trotsky"

export type StepPostRepostOutput = { "uri": string; "cid": string }

export class StepPostRepost<P = StepPost, C extends StepPostOutput = StepPostOutput, O = null> extends Step<P, C, O> {
  async apply () {
    const { uri, cid } = this.context as C
    this.output = await this.agent.repost(uri, cid) as O
  }
}
