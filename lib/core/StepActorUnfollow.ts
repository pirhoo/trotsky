import matchProperty from "./utils/matchProperty"
import { Step,  StepActor, type StepActorOutput } from "../trotsky"

export class StepActorUnfollow<P = StepActor, C extends StepActorOutput = StepActorOutput, O = null> extends Step<P, C, O> {
  async apply () {
    if (!this.context) {
      throw new Error("No context found for StepActorUnfollow")
    }
      
    const actor = this.agent.did!
    const others = [this.context.did]
    const { "data": { relationships } } = await this.agent.app.bsky.graph.getRelationships({ actor, others })
    const relationship = relationships.find(matchProperty("did", this.context.did))
    // if the relationship does not exist, there is nothing to do
    if (!relationship?.following) return
    await this.agent.deleteFollow(relationship.following as string)
  }
}

