
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
  followers () {
    return this.append(StepActorFollowers<this>)
  }

  followings () {
    return this.append(StepActorFollowings<this>)
  }

  likes () {
    return this.append(StepActorLikes<this>)
  }

  posts () {
    return this.append(StepActorPosts<this>)
  }

  streamPosts () {
    return this.append(StepActorStreamPosts<this>)
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