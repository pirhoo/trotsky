import {
  Step,
  StepActorBlock,
  StepActorFollow,
  StepActorFollowers,
  StepActorFollowings,
  StepActorLists,
  StepActorLikes,
  StepActorMute,
  StepActorPosts,
  StepActorUnblock,
  StepActorUnfollow,
  StepActorUnmute,
  StepActorStreamPosts
} from "../../trotsky"

/**
 * A mixin class providing reusable actor-related methods to extend step functionality.
 * These methods append specific actor-related steps to the current chain.
 * 
 * @typeParam P - The parent step type.
 * @typeParam C - The context type.
 * @typeParam O - The output type.
 * 
 * @public
 */
export abstract class ActorMixins<P, C, O> extends Step<P, C, O> {

  /**
   * Appends a step to fetch the followers of the current actor.
   * 
   * @returns The appended {@link StepActorFollowers} instance.
   */
  followers (): StepActorFollowers<this> {
    return this.append(StepActorFollowers<this>)
  }

  /**
   * Appends a step to fetch the followings of the current actor.
   * 
   * @returns The appended {@link StepActorFollowings} instance.
   */
  followings (): StepActorFollowings<this> {
    return this.append(StepActorFollowings<this>)
  }

  /**
   * Appends a step to fetch the liked posts of the current actor.
   * 
   * @returns The appended {@link StepActorLikes} instance.
   */
  likes (): StepActorLikes<this> {
    return this.append(StepActorLikes<this>)
  }

  /**
   * Appends a step to fetch the lists of the current actor.
   * 
   * @returns The appended {@link StepActorLists} instance.
   */
  lists (): StepActorLists<this> {
    return this.append(StepActorLists<this>)
  }

  /**
   * Appends a step to fetch the posts of the current actor.
   * 
   * @returns The appended {@link StepActorPosts} instance.
   */
  posts (): StepActorPosts<this> {
    return this.append(StepActorPosts<this>)
  }

  /**
   * Appends a step to stream the posts of the current actor.
   * 
   * @typeParam T - The type of the stream posts step, defaulting to {@link StepActorStreamPosts}.
   * @returns The appended {@link StepActorStreamPosts} instance.
   */
  streamPosts<T = StepActorStreamPosts<this>>(): T {
    return this.append(StepActorStreamPosts<this>) as T
  }

  /**
   * Appends a step to block the current actor.
   * 
   * @returns The current instance for method chaining.
   */
  block () {
    this.append(StepActorBlock<this>)
    return this
  }

  /**
   * Appends a step to unblock the current actor.
   * 
   * @returns The current instance for method chaining.
   */
  unblock () {
    this.append(StepActorUnblock<this>)
    return this
  }

  /**
   * Appends a step to follow the current actor.
   * 
   * @returns The current instance for method chaining.
   */
  follow () {
    this.append(StepActorFollow<this>)
    return this
  }

  /**
   * Appends a step to unfollow the current actor.
   *
   * @returns The current instance for method chaining.
   */
  unfollow () {
    this.append(StepActorUnfollow<this>)
    return this
  }

  /**
   * Appends a step to mute the current actor.
   *
   * @returns The current instance for method chaining.
   */
  mute () {
    this.append(StepActorMute<this>)
    return this
  }

  /**
   * Appends a step to unmute the current actor.
   *
   * @returns The current instance for method chaining.
   */
  unmute () {
    this.append(StepActorUnmute<this>)
    return this
  }
}
