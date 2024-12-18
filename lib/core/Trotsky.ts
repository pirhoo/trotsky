import type { AtpAgent } from '@atproto/api'

class Trotsky {
  declare agent: AtpAgent

  constructor(agent: AtpAgent) {
    this.agent = agent
  }

  static init(agent: AtpAgent) {
    return new Trotsky(agent)
  } 
}

export default Trotsky