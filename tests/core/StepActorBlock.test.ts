import { AtpAgent } from '@atproto/api'
import { TestNetwork, SeedClient, usersSeed } from '@atproto/dev-env'

import { Trotsky } from '../../lib/trotsky'

describe('StepActorBlock', () => {
  let network: TestNetwork
  let agent: AtpAgent
  let sc: SeedClient
  let alice: { did: string, handle: string, password: string }
  let bob: { did: string, handle: string, password: string }
  
  beforeAll(async () => {
    network = await TestNetwork.create({ dbPostgresSchema: 'trotsky_step_actor_block' })
    agent = network.pds.getClient()
    
    sc = network.getSeedClient()
    await usersSeed(sc)

    bob = sc.accounts[sc.dids.bob]
    alice = sc.accounts[sc.dids.alice]

    await network.processAll()
    await agent.login({ identifier: bob.handle, password: bob.password })
  })

  afterAll(async () => {
    await network.close()
  })

  test('block Alice', async () => {
    await Trotsky.init(agent).actor(alice.handle).block().wait(1e3).run()
    const { data: { blocks } } = await agent.app.bsky.graph.getBlocks()

    expect(blocks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ 
          handle: alice.handle
        })
      ])
    )
  })
})