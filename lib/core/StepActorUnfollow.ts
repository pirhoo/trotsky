import { Step } from "../trotsky"

export class StepActorUnfollow extends Step {
  async apply() {
      const actor = this.agent.did as string
      const others = [this.context.did]
      const { data: { relationships } } = await this.agent.app.bsky.graph.getRelationships({ actor, others })
      const relationship = relationships.find(({ did }) => did === this.context.did)
      // if the relationship does not exist, there is nothing to do
      if (!relationship?.following) return
      await this.agent.deleteFollow(relationship.following as string)
  }
}

