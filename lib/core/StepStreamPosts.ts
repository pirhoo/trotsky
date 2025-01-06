import { AtUri } from "@atproto/api"
import { StepPostsEntry, StepBuilderStream, type StepPostOutput } from "../trotsky"
import { buildEventEmitter, JetstreamMessageCommit } from "./utils/jetstream"

/**
 * @experimental
 *
 * Represents a streaming step that processes posts in real-time.
 *
 * @typeParam P - The type of the parent constraint.
 * @typeParam C - The type of the context.
 * @typeParam O - The type of the output, defaults to `StepPostOutput`.
 * @public
 *
 * @remarks
 * This class allows for the streaming and processing of posts as they are
 * committed to the network. To achieve this, it utilizes the Bluesky Firehose
 * API to listen for post events and process them in real-time. The stream can
 * use a lot of bandwidth since it processes every post event. 
 *
 * @see {@link StepBuilderStream}
 */
export class StepStreamPosts<P, C = unknown, O = StepPostOutput> extends StepBuilderStream<P, C, O> {
  _steps: StepPostsEntry<this>[] = []

  /**
   * Adds a {@link StepPostsEntry} step to the stream.
   *
   * @returns The new {@link StepPostsEntry} instance.
   */
  each (): StepPostsEntry<this> {
    return this.append(StepPostsEntry<this>)
  }

  /**
   * Builds and returns an event emitter configured for post events.
   *
   * @returns The event emitter instance.
   */
  get eventEmitter () {
    return buildEventEmitter(["app.bsky.feed.post"])
  }

  /**
   * Resolves the output for a given commit message.
   *
   * @param message - The commit message containing post data.
   * @returns A promise that resolves to the output object.
   */
  async resolveOutput (message: JetstreamMessageCommit): Promise<O> {
    const commit = message.commit
    const cid = commit.cid
    const record = commit.record
    const uri = AtUri.make(message.did, commit.collection, commit.rkey).toString()
    return { uri, cid, record } as O
  }
}
