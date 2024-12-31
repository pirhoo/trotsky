import { StepActors } from '../trotsky'
import { ActorMixins } from './mixins/ActorMixins'

export class StepActorsEntry<Parent extends StepActors> extends ActorMixins {
  back() {
    return super.back() as Parent
  }

  async apply() {
    console.log('Iterate over actor entries')
  }
}