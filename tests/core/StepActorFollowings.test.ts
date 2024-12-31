import { AtpAgent } from '@atproto/api'
import { TestNetwork, SeedClient, followsSeed } from '@atproto/dev-env'

import { Trotsky } from '../../lib/trotsky'

describe('StepActorFollowings', () => {
  let network: TestNetwork
  let agent: AtpAgent
  let sc: SeedClient
  let alice: { handle: string, password: string }
  let bob: { handle: string, password: string }
  
  beforeAll(async () => {
    network = await TestNetwork.create({ dbPostgresSchema: 'trotsky_step_actor_followings' })
    agent = network.pds.getClient()
    
    sc = network.getSeedClient()
    await followsSeed(sc)

    bob = sc.accounts[sc.dids.bob]
    alice = sc.accounts[sc.dids.alice]

    await network.processAll()
    await agent.login({ identifier: bob.handle, password: bob.password })
  })

  afterAll(async () => {
    await network.close()
  })

  test('get Alice\'s all 4 followings', async () => {
    const trotsky = Trotsky.init(agent).actor(alice.handle)
    const followings = trotsky.followings()
    await trotsky.run()
    expect(followings.context).toBeInstanceOf(Array)
    expect(followings.context).toHaveLength(4)
  })


  test('get Alice\'s 2 first followings', async () => {
    const trotsky = Trotsky.init(agent).actor(alice.handle)
    const followings = trotsky.followings().take(2)
    await trotsky.run()
    expect(followings.context).toBeInstanceOf(Array)
    expect(followings.context).toHaveLength(2)
  })

  test('get Alice\'s 2 last followings', async () => {
    const trotsky = Trotsky.init(agent).actor(alice.handle)
    const followings = trotsky.followings().skip(2)
    await trotsky.run()
    expect(followings.context).toBeInstanceOf(Array)
    expect(followings.context).toHaveLength(2)
  })

})