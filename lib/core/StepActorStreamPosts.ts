import { type PostRecord } from "@atproto/api"
import { StepStreamPosts, type StepActorOutput } from "../trotsky"
import { buildEventEmitter, JetstreamMessageCommit } from "./utils/jetstream"

export type StepActorStreamPostsOutput = JetstreamMessageCommit & { "record": Partial<PostRecord> }

export class StepActorStreamPosts<P, C extends StepActorOutput = StepActorOutput, O = StepActorStreamPostsOutput> extends StepStreamPosts<P, C, O> {
  get eventEmitter () {
    if (!this.context) {
      throw new Error("No context found for StepActorStreamPosts")
    }

    return buildEventEmitter(["app.bsky.feed.post"], [this.context.did])
  }
}