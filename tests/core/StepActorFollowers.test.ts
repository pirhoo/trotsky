import { AtpAgent } from '@atproto/api'
import { TestNetwork, SeedClient, followsSeed } from '@atproto/dev-env'

import { Trotsky } from '../../lib/trotsky'

describe('StepActorFollowers', () => {
  let network: TestNetwork
  let agent: AtpAgent
  let sc: SeedClient
  let alice: { handle: string, password: string }
  let bob: { handle: string, password: string }
  
  beforeAll(async () => {
    network = await TestNetwork.create({ dbPostgresSchema: 'trotsky_step_actor_followers' })
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

  test('get Alice\'s all 4 followers', async () => {
    const trotsky = Trotsky.init(agent).actor(alice.handle)
    const followers = trotsky.followers()
    await trotsky.run()
    expect(followers.context).toBeInstanceOf(Array)
    expect(followers.context).toHaveLength(4)
  })

  test('get Alice\'s 2 first followers', async () => {
    const trotsky = Trotsky.init(agent).actor(alice.handle)
    const followers = trotsky.followers().take(2)
    await trotsky.run()
    expect(followers.context).toBeInstanceOf(Array)
    expect(followers.context).toHaveLength(2)
  })

  test('get Alice\'s 2 last followers', async () => {
    const trotsky = Trotsky.init(agent).actor(alice.handle)
    const followers = trotsky.followers().skip(2)
    await trotsky.run()
    expect(followers.context).toBeInstanceOf(Array)
    expect(followers.context).toHaveLength(2)
  })
})