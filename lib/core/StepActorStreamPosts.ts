import { type PostRecord } from "@atproto/api"
import { StepStreamPosts, type StepActorOutput } from "../trotsky"
import { buildEventEmitter, JetstreamMessageCommit } from "./utils/jetstream"

/**
 * Combines a Jetstream message commit with a partial post record.
 * Typically represents the streamed output of a single post event.
 * @public
 */
export type StepActorStreamPostsOutput = JetstreamMessageCommit & { "record": Partial<PostRecord> }

/**
 * @experimenjtal
 * 
 * A specialized step that extends {@link StepStreamPosts} to stream an actor's posts.
 * It uses a Jetstream-based event emitter filtered by the actor's DID.
 *
 * @typeParam P - The parent type of this step.
 * @typeParam C - The context or child output type, extending {@link StepActorOutput}.
 * @typeParam O - The final output type of this step, defaulting to {@link StepActorStreamPostsOutput}.
 */
export class StepActorStreamPosts<P, C extends StepActorOutput = StepActorOutput, O = StepActorStreamPostsOutput> extends StepStreamPosts<P, C, O> {

  /**
   * Provides an event emitter that listens for "app.bsky.feed.post" events associated with this actor.
   * Throws an error if no context (i.e., actor DID) is available.
   *
   * @returns The event emitter for streaming actor-specific posts.
   */
  get eventEmitter () {
    if (!this.context) {
      throw new Error("No context found for StepActorStreamPosts")
    }

    return buildEventEmitter(["app.bsky.feed.post"], [this.context.did])
  }
}
