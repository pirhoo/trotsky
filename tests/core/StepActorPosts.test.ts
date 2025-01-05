import { afterAll, beforeAll, describe, expect, test } from "@jest/globals"
import { AtpAgent } from "@atproto/api"
import { TestNetwork, SeedClient, usersSeed } from "@atproto/dev-env"

import { Trotsky } from "../../lib/trotsky"

describe("StepActorPosts", () => {
  let network: TestNetwork
  let agentBsky: AtpAgent
  let agentPds: AtpAgent
  let sc: SeedClient
  let bob: { "did": string; "handle": string; "password": string }
  
  beforeAll(async () => {
    network = await TestNetwork.create({ "dbPostgresSchema": "step_actor_posts" })
    agentBsky = network.bsky.getClient()   
    agentPds = network.pds.getClient()   
    sc = network.getSeedClient()
    await usersSeed(sc)
    await sc.post(sc.dids.bob, "Dan Dan Noodle is my favorite meal")
    await sc.post(sc.dids.bob, "This is no such thing as a free lunch")  
    await network.processAll()
    bob = sc.accounts[sc.dids.bob]
    await agentPds.login({ "identifier": bob.handle, "password": bob.password })
  })

  afterAll(async () => {
    // For some reason the AppView schema is not being dropped
    await network.bsky.db.db.schema.dropSchema("appview_step_actor_posts").cascade().execute()
    await network.close()
  })

  test("get Bob's posts", async () => {
    const trotsky = Trotsky.init(agentBsky).actor(sc.dids.bob)
    const posts = trotsky.posts()
    await trotsky.run()
    expect(posts.output).toBeInstanceOf(Array)
    expect(posts.output).toHaveLength(2)
  })

  test("like 5 Bob's posts without throwing an exception", async () => {
    /* eslint-disable @stylistic/ts/indent */
    const trotsky = Trotsky.init(agentBsky)
        .actor(sc.dids.bob)
        .posts()
          .take(5)
            .each()
              .withAgent(agentPds)
              .like()
    /* eslint-enable @stylistic/ts/indent */
    await expect(trotsky.run()).resolves.not.toThrow()
  })
})