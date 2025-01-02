import { AtpAgent } from '@atproto/api'
import { TestNetwork, SeedClient, usersSeed } from '@atproto/dev-env'

import { Trotsky } from '../../lib/trotsky'

describe.skip('StepPostReply', () => {
  let network: TestNetwork
  let agent: AtpAgent
  let sc: SeedClient
  let bob: { did: string, handle: string, password: string }
  
  beforeAll(async () => {
    network = await TestNetwork.create({ dbPostgresSchema: 'step_post_reply' })
    agent = network.pds.getClient()    
    sc = network.getSeedClient()
    await usersSeed(sc)
    bob = sc.accounts[sc.dids.bob]
    await sc.post(sc.dids.bob, 'Dan Dan Noodle is my favorite meal')    
    await network.processAll()
    await agent.login({ identifier: bob.handle, password: bob.password })
  })

  afterAll(async () => {
    // For some reason the AppView schema is not being dropped
    await network.bsky.db.db.schema.dropSchema('appview_step_post_reply').cascade().execute()
    await network.close()
  })

  test('reply to the post', async () => {
    const { uri } = sc.posts[sc.dids.bob][0].ref
    const reply = Trotsky.init(agent).post(uri).reply({ text: 'I love it too!' })
    await reply.run()
    expect(reply.context).toHaveProperty('record')
    expect(reply.context.record).toHaveProperty('text', 'Love it too!')
    expect(reply.context.record).toHaveProperty('reply')
  })
})