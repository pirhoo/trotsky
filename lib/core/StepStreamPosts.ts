import { type PostRecord } from "@atproto/api"
import { StepStream } from "../trotsky"
import { buildEventEmitter, JetstreamMessageCommit } from "./utils/jetstream"

export type StepStreamPostsOutput = JetstreamMessageCommit & { "record": Partial<PostRecord> }

export class StepStreamPosts<P, C = null, O = StepStreamPostsOutput> extends StepStream<P, C, O> {
  get eventEmitter () {
    return buildEventEmitter(["app.bsky.feed.post"])
  }
}