
import {
  Step, 
  StepActorBlock, 
  StepActorFollow, 
  StepActorFollowers, 
  StepActorFollowings, 
  StepActorLikes, 
  StepActorPosts, 
  StepActorUnblock, 
  StepActorUnfollow,
  StepActorStreamPosts
} from "../../trotsky"

export abstract class ActorMixins<P, C, O> extends Step<P, C, O> {
  followers (): StepActorFollowers<this> {
    return this.append(StepActorFollowers<this>)
  }

  followings (): StepActorFollowings<this> {
    return this.append(StepActorFollowings<this>)
  }

  likes (): StepActorLikes<this> {
    return this.append(StepActorLikes<this>)
  }

  posts (): StepActorPosts<this> {
    return this.append(StepActorPosts<this>)
  }

  streamPosts<T = StepActorStreamPosts<this>>(): T {
    return this.append(StepActorStreamPosts<this>) as T
  }

  block () {
    this.append(StepActorBlock<this>)
    return this
  }

  unblock () {
    this.append(StepActorUnblock<this>)
    return this
  }

  follow () {
    this.append(StepActorFollow<this>)
    return this
  }

  unfollow () {
    this.append(StepActorUnfollow<this>)
    return this
  }
}