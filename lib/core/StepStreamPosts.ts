import { AtUri } from "@atproto/api"
import { StepPostsEntry, StepStream, type StepPostOutput } from "../trotsky"
import { buildEventEmitter, JetstreamMessageCommit } from "./utils/jetstream"


export class StepStreamPosts<P, C = unknown, O = StepPostOutput> extends StepStream<P, C, O> {
  _steps: StepPostsEntry<this>[] = []

  each (): StepPostsEntry<this> {
    return this.append(StepPostsEntry<this>)
  }

  get eventEmitter () {
    return buildEventEmitter(["app.bsky.feed.post"])
  }

  async resolveOutput (message: JetstreamMessageCommit): Promise<O> {
    const commit = message.commit
    const uri = AtUri.make(message.did, commit.collection, commit.rkey).toString()
    const { "data": { posts } } = await this.agent.getPosts({ "uris": [uri] })
    return posts.shift() as O
  }
}