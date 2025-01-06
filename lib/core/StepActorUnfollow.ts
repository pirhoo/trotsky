import matchProperty from "./utils/matchProperty"
import { Step, StepActor, type StepActorOutput } from "../trotsky"

/**
 * A step that unfollows the current actor (if followed).
 * 
 * @typeParam P - The parent step type, defaulting to {@link StepActor}.
 * @typeParam C - The context or child output type, defaulting to {@link StepActorOutput}.
 * @typeParam O - The output type produced by this step, defaulting to `null`.
 * @public
 */
export class StepActorUnfollow<P = StepActor, C extends StepActorOutput = StepActorOutput, O = null> extends Step<P, C, O> {

  /**
   * Applies the unfollow logic:
   * 1. Retrieves the current actor's relationship with the specified context actor.
   * 2. Checks if the current actor is indeed following the specified context actor.
   * 3. If so, calls the API to remove the follow relationship.
   * 
   * @throws Error
   * If no context is available for the step, indicating the actor is unknown.
   */
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
