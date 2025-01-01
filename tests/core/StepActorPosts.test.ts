import { AtpAgent } from '@atproto/api'
import { TestNetwork, SeedClient, usersSeed } from '@atproto/dev-env'

import { Trotsky } from '../../lib/trotsky'

describe.skip('StepActorFollowers', () => {
  let network: TestNetwork
  let agent: AtpAgent
  let sc: SeedClient
  let bob: { did: string,  handle: string, password: string }
  
  beforeAll(async () => {
    network = await TestNetwork.create({ dbPostgresSchema: 'trotsky_step_actor_likes' })
    agent = network.pds.getClient()
    
    sc = network.getSeedClient()
    await usersSeed(sc)
    await sc.post(sc.dids.bob, 'Dan Dan Noodle is my favorite meal')
    await sc.post(sc.dids.bob, 'This is no such thing as a free lunch')
    
    bob = sc.accounts[sc.dids.bob]

    await network.processAll()
    await agent.login({ identifier: bob.handle, password: bob.password })
  })

  afterAll(async () => {
    await network.close()
  })

  test('get user\'s posts', async () => {
    const trotsky = Trotsky.init(agent).actor(bob.handle)
    const posts = trotsky.posts()
    await trotsky.run()
    expect(posts.context).toBeInstanceOf(Array)
    expect(posts.context).toHaveLength(2)
  })
})