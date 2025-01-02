import { Trotsky } from '../trotsky'

export abstract class Step extends Trotsky {
  abstract apply(): Promise<void>
}