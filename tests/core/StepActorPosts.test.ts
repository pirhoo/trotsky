import { afterAll, beforeAll, describe, expect, test } from "@jest/globals"
import { AtpAgent } from "@atproto/api"
import { TestNetwork, SeedClient, usersSeed } from "@atproto/dev-env"

import { Trotsky } from "../../lib/trotsky"

describe("StepActorPosts", () => {
  let network: TestNetwork
  let agent: AtpAgent
  let sc: SeedClient
  
  beforeAll(async () => {
    network = await TestNetwork.create({ "dbPostgresSchema": "step_actor_posts" })
    agent = network.bsky.getClient()    
    sc = network.getSeedClient()
    await usersSeed(sc)
    await sc.post(sc.dids.bob, "Dan Dan Noodle is my favorite meal")
    await sc.post(sc.dids.bob, "This is no such thing as a free lunch")  
    await network.processAll()
  })

  afterAll(async () => {
    // For some reason the AppView schema is not being dropped
    await network.bsky.db.db.schema.dropSchema("appview_step_actor_posts").cascade().execute()
    await network.close()
  })

  test("get Bob's posts", async () => {
    const trotsky = Trotsky.init(agent).actor(sc.dids.bob)
    const posts = trotsky.posts()
    await trotsky.run()
    expect(posts.output).toBeInstanceOf(Array)
    expect(posts.output).toHaveLength(2)
  })
})