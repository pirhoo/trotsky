import type { AtpAgent } from "@atproto/api"
import type { QueryParams } from "@atproto/api/src/client/types/app/bsky/feed/searchPosts"

import type { StepActorParam } from "./StepActor"
import type { StepPostUri } from "./StepPost"
import type { StepPostsUris } from "./StepPosts"
import type { StepCreatePostParams } from "./StepCreatePost"
import type { StepWhenPredicate } from "./StepWhen"
import type { StepTapInterceptor } from "./StepTap"
import type { StepTimelineQueryParams } from "./StepTimeline"
import type { Resolvable } from "./utils/resolvable"
import type { StepStarterPackUri } from "./StepStarterPack"
import type { StepStarterPacksUris } from "./StepStarterPacks"
import type { StepSearchStarterPacksQueryParams } from "./StepSearchStarterPacks"
import type { StepSearchActorsQueryParams } from "./StepSearchActors"
import type { StepFeedUri } from "./StepFeed"
import type { StepFeedGeneratorUri } from "./StepFeedGenerator"

import {
  StepActor,
  StepActorBlocks,
  StepActorMutes,
  StepActorSuggestions,
  StepActors,
  StepWait,
  StepPost,
  StepCreatePost,
  StepFeed,
  StepFeedGenerator,
  StepList,
  StepListUri,
  StepStarterPack,
  StepStarterPacks,
  StepSearchActors,
  StepSearchPosts,
  StepSearchStarterPacks,
  StepStreamPosts,
  StepTap,
  StepWhen,
  StepBuilder,
  StepActorsParam,
  StepPosts,
  StepSave,
  StepSavePath,
  StepTimeline
} from "../trotsky"

/**
 * Trotsky orchestrates a sequence of steps that interact with an {@link AtpAgent}.
 * @typeParam P - Type of the parent object.
 * @typeParam C - Type of the context object.
 * @typeParam O - Type of the output object.
 * @public
 */
export class Trotsky extends StepBuilder  {

  /**
   * Adds a {@link StepActor} step.
   * @param param - Parameters for the actor step.
   * @returns The new {@link StepActor} instance.
   */
  actor (param: Resolvable<StepActorParam>): StepActor<this> {
    return this.append(StepActor<this>, param)
  }

  /**
   * Adds a {@link StepActors} step.
   * @param param - Parameters for the actors step.
   * @returns The new {@link StepActors} instance.
   */
  actors (param: Resolvable<StepActorsParam>): StepActors<this> {
    return this.append(StepActors<this>, param)
  }

  /**
   * Adds a {@link StepActorBlocks} step.
   * @returns The new {@link StepActorBlocks} instance.
   */
  blocks (): StepActorBlocks<this> {
    return this.append(StepActorBlocks<this>)
  }

  /**
   * Adds a {@link StepActorMutes} step.
   * @returns The new {@link StepActorMutes} instance.
   */
  mutes (): StepActorMutes<this> {
    return this.append(StepActorMutes<this>)
  }

  /**
   * Adds a {@link StepActorSuggestions} step.
   * @returns The new {@link StepActorSuggestions} instance.
   */
  suggestions (): StepActorSuggestions<this> {
    return this.append(StepActorSuggestions<this>)
  }

  /**
   * Adds a {@link StepFeed} step.
   * @param uri - The feed URI.
   * @returns The new {@link StepFeed} instance.
   */
  feed (uri: Resolvable<StepFeedUri>): StepFeed<this> {
    return this.append(StepFeed<this>, uri)
  }

  /**
   * Adds a {@link StepFeedGenerator} step.
   * @param uri - The feed generator URI.
   * @returns The new {@link StepFeedGenerator} instance.
   */
  feedGenerator (uri: Resolvable<StepFeedGeneratorUri>): StepFeedGenerator<this> {
    return this.append(StepFeedGenerator<this>, uri)
  }

  /**
   * Adds a {@link StepPost} step.
   * @param uri - The post URI.
   * @returns The new {@link StepPost} instance.
   */
  post (uri: Resolvable<StepPostUri>): StepPost<this> {
    return this.append(StepPost<this>, uri)
  }

  /**
   * Adds a {@link StepPosts} step.
   * @param uris - The post URIs.
   * @returns The new {@link StepPosts} instance.
   */
  posts (uris: Resolvable<StepPostsUris>): StepPosts<this> {
    return this.append(StepPosts<this>, uris)
  }

  /**
   * Adds a {@link StepCreatePost} step.
   * @param record - Parameters for creating a post.
   * @returns The new {@link StepCreatePost} instance.
   */
  createPost (record: StepCreatePostParams): StepCreatePost<this> {
    return this.append(StepCreatePost<this>, record)
  }

  /**
   * Adds a {@link StepList} step.
   * @param uri - The list URI.
   * @returns The new {@link StepList} instance.
   */
  list (uri: Resolvable<StepListUri>) {
    return this.append(StepList, uri)
  }

  /**
   * Adds a {@link StepStarterPack} step.
   * @param uri - The starter pack URI.
   * @returns The new {@link StepStarterPack} instance.
   */
  starterPack (uri: Resolvable<StepStarterPackUri>) {
    return this.append(StepStarterPack, uri)
  }

  /**
   * Adds a {@link StepStarterPacks} step.
   * @param uris - The starter pack URIs.
   * @returns The new {@link StepStarterPacks} instance.
   */
  starterPacks (uris: Resolvable<StepStarterPacksUris>): StepStarterPacks<this> {
    return this.append(StepStarterPacks<this>, uris)
  }

  /**
   * Adds a {@link StepSearchPosts} step.
   * @param queryParams - Search parameters.
   * @returns The new {@link StepSearchPosts} instance.
   */
  searchPosts (queryParams: QueryParams): StepSearchPosts<this> {
    return this.append(StepSearchPosts<this>, queryParams)
  }

  /**
   * Adds a {@link StepSearchActors} step.
   * @param queryParams - Search parameters.
   * @returns The new {@link StepSearchActors} instance.
   */
  searchActors (queryParams: StepSearchActorsQueryParams): StepSearchActors<this> {
    return this.append(StepSearchActors<this>, queryParams)
  }

  /**
   * Adds a {@link StepSearchStarterPacks} step.
   * @param queryParams - Search parameters.
   * @returns The new {@link StepSearchStarterPacks} instance.
   */
  searchStarterPacks (queryParams: StepSearchStarterPacksQueryParams): StepSearchStarterPacks<this> {
    return this.append(StepSearchStarterPacks<this>, queryParams)
  }

  /**
   * Adds a {@link StepStreamPosts} step.
   * @returns The new {@link StepStreamPosts} instance.
   */
  streamPosts<T = StepStreamPosts<this>>(): T {
    return this.append(StepStreamPosts<this>) as T
  }

  /**
   * Adds a {@link StepTimeline} step.
   * @param queryParams - Optional query parameters for the timeline.
   * @returns The new {@link StepTimeline} instance.
   */
  timeline (queryParams: StepTimelineQueryParams = {}): StepTimeline<this> {
    return this.append(StepTimeline<this>, queryParams)
  }

  /**
   * Adds a {@link StepSave} step.
   * @param path - The path of the JSON file to save the output. If not provided, the file path will be created using the current step name.
   * @returns The current {@link Trotsky} instance.
   */
  save (path: StepSavePath = null) {
    this.append(StepSave<this>, path)
    return this
  }

  /**
   * Adds a {@link StepWait} step.
   * @param duration - The duration to wait, in milliseconds.
   * @returns The current {@link Trotsky} instance.
   */
  wait (duration = 0) {
    this.append(StepWait<this>, duration)
    return this
  }

  /**
   *Adds a {@link StepWhen} step.
   * @param predicate - The predicate function.
   * @returns The current {@link Trotsky} instance.
   */
  when (predicate: Resolvable<StepWhenPredicate>) {
    this.append(StepWhen<this>, predicate)
    return this
  }

  /**
   * Adds a {@link StepTap} step.
   * @returns The current {@link Trotsky} instance.
   */
  tap (interceptor: StepTapInterceptor) {
    this.append(StepTap<this>, interceptor)
    return this
  }

  /**
   * Initializes a new {@link Trotsky} instance with the specified agent.
   * @param agent - The {@link AtpAgent} instance.
   * @returns A new {@link Trotsky} instance.
   */
  static init (agent: AtpAgent): Trotsky {
    return new Trotsky(agent)
  }
}
