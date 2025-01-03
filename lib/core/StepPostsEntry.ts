import type { StepPosts, StepPostsOutput } from '../trotsky'
import { PostMixins } from './mixins/PostMixins'


export class StepPostsEntry<P = StepPosts, C extends StepPostsOutput = StepPostsOutput, O = null> extends PostMixins<P, C, O> {
  async apply() {
    console.log('Iterate over post entries')
  }
}
