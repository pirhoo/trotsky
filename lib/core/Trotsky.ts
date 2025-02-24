import type { AtpAgent } from "@atproto/api"
import type { QueryParams } from "@atproto/api/src/client/types/app/bsky/feed/searchPosts"

import type { StepActorParam } from "./StepActor"
import type { StepPostUri } from "./StepPost"
import type { StepPostsUris } from "./StepPosts"
import type { StepCreatePostParams } from "./StepCreatePost"
import type { StepWhenPredicate } from "./StepWhen"
import type { StepTapInterceptor } from "./StepTap"
import type { Resolvable } from "./utils/resolvable"

import { 
  StepActor, 
  StepActors,
  StepWait, 
  StepPost,
  StepCreatePost, 
  StepList, 
  StepListUri,
  StepSearchPosts, 
  StepStreamPosts, 
  StepTap, 
  StepWhen, 
  StepBuilder,
  StepActorsParam,
  StepPosts,
  StepSave,
  StepSavePath
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
   * Adds a {@link StepSearchPosts} step.
   * @param queryParams - Search parameters.
   * @returns The new {@link StepSearchPosts} instance.
   */
  searchPosts (queryParams: QueryParams): StepSearchPosts<this> {
    return this.append(StepSearchPosts<this>, queryParams)
  }

  /**
   * Adds a {@link StepStreamPosts} step.
   * @returns The new {@link StepStreamPosts} instance.
   */
  streamPosts<T = StepStreamPosts<this>>(): T {
    return this.append(StepStreamPosts<this>) as T
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
