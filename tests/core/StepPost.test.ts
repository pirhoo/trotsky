import { AtpAgent } from '@atproto/api'
import { TestNetwork, SeedClient, usersSeed } from '@atproto/dev-env'

import { Trotsky } from '../../lib/trotsky'

describe('StepPost', () => {
  let network: TestNetwork
  let agent: AtpAgent
  let sc: SeedClient
  
  beforeAll(async () => {
    network = await TestNetwork.create({ dbPostgresSchema: 'trotsky_step_post' })
    agent = network.bsky.getClient()    
    sc = network.getSeedClient()
    await usersSeed(sc)
    await sc.post(sc.dids.bob, 'Dan Dan Noodle is my favorite meal')    
    await network.processAll()
  })

  afterAll(async () => {
    // For some reasong the AppView schema is not being dropped
    await network.bsky.db.db.schema.dropSchema('appview_trotsky_step_search_posts').cascade().execute()
    await network.close()
  })

  test('get the post', async () => {
    const { uri } = sc.posts[sc.dids.bob][0].ref
    const post = Trotsky.init(agent).post(uri)
    await post.run()
  })
})