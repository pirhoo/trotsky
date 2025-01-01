import { AtpAgent } from '@atproto/api'
import { TestNetwork, SeedClient, usersSeed } from '@atproto/dev-env'

import { Trotsky, StepSearchPosts } from '../../lib/trotsky'

describe('StepSearchPosts', () => {
  let network: TestNetwork
  let agent: AtpAgent
  let sc: SeedClient

  beforeAll(async () => {
    network = await TestNetwork.create({ dbPostgresSchema: 'trotsky_step_search_posts' })
    agent = network.bsky.getClient()  
    sc = network.getSeedClient()
    await usersSeed(sc)
    await sc.post(sc.dids.bob, 'I hate football')
    await sc.post(sc.dids.bob, 'I love food')
    await network.processAll()
  })

  afterAll(async () => {
    // For some reasong the AppView schema is not being dropped
    await network.bsky.db.db.schema.dropSchema('appview_trotsky_step_search_posts').cascade().execute()
    await network.close()
  })

  test('search 2 posts for "foo"', async () => {
    const posts = Trotsky.init(agent).searchPosts({ q: 'foo' })
    await posts.run()
    
    expect(posts).toBeInstanceOf(StepSearchPosts)
    expect(posts.context).toBeInstanceOf(Array)
    expect(posts.context).toHaveLength(2)
  })

  test('search 1 post for "love"', async () => {
    const posts = Trotsky.init(agent).searchPosts({ q: 'love' })
    await posts.run()
    
    expect(posts).toBeInstanceOf(StepSearchPosts)
    expect(posts.context).toBeInstanceOf(Array)
    expect(posts.context).toHaveLength(1)
  })
})