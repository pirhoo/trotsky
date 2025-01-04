import { Step, type StepPost, type StepPostOutput } from "../trotsky"


export class StepPostLike<P = StepPost, C extends StepPostOutput = StepPostOutput, O = null> extends Step<P, C, O> {
  async apply () {
    const { uri, cid } = this.context as C
    await this.agent.like(uri, cid)
  }
}
