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

    bob = sc.accounts[sc.dids.bob]
    // Create a post as Alice and like it as Bob
    await sc.post(sc.dids.alice, 'Dan Dan Noodle is my favorite meal')
    await sc.like(sc.dids.bob, sc.posts[sc.dids.alice][0].ref)

    await network.processAll()
    await agent.login({ identifier: bob.handle, password: bob.password })
  })

  afterAll(async () => {
    await network.close()
  })

  test('get user\'s likes', async () => {
    const trotsky = Trotsky.init(agent).actor(bob.handle)
    const followers = trotsky.likes()
    await trotsky.run()
    expect(followers.context).toBeInstanceOf(Array)
    expect(followers.context).toHaveLength(1)
  })
})