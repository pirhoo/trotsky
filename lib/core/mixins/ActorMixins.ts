
import { Step, StepActorBlock, StepActorFollow, StepActorFollowers, StepActorFollowings, StepActorLikes, StepActorPosts, StepActorUnblock, StepActorUnfollow } from '../../trotsky'

export class ActorMixins extends Step {
  followers() {
    return this.append(StepActorFollowers)
  }

  followings() {
    return this.append(StepActorFollowings)
  }

  likes() {
    return this.append(StepActorLikes)
  }

  posts() {
    return this.append(StepActorPosts)
  }

  block() {
    this.append(StepActorBlock)
    return this
  }

  unblock() {
    this.append(StepActorUnblock)
    return this
  }

  follow() {
    this.append(StepActorFollow)
    return this
  }

  unfollow() {
    this.append(StepActorUnfollow)
    return this
  }
}