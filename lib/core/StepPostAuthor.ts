import { StepActor, type StepActorOutput, type StepPost, type StepPostOutput } from "../trotsky"


export type StepPostAuthorOutput = StepActorOutput

export class StepPostAuthor<P = StepPost, C extends StepPostOutput = StepPostOutput, O extends StepPostAuthorOutput = StepPostAuthorOutput> extends StepActor<P, C, O> {

  async apply () {
    if (!this.context) {
      throw new Error("No context found for StepPostAuthor")
    }
    
    const actor = this.context.author.did
    const { data } = await this.agent.getProfile({ actor })
    this.output = data as O
  }
}