import type { StepPosts } from '../trotsky'
import { PostMixins } from './mixins/PostMixins'


export class StepPostsEntry<Parent extends StepPosts> extends PostMixins {
  back() {
    return super.back() as Parent
  }

  async apply() {
    console.log('Iterate over post entries')
  }
}
