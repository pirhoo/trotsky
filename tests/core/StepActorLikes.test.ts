import { afterAll, beforeAll, describe, expect, test } from "@jest/globals"
import { AtpAgent } from "@atproto/api"
import { TestNetwork, SeedClient, usersSeed } from "@atproto/dev-env"

import { Trotsky } from "../../lib/trotsky"

describe.skip("StepActorLikes", () => {
  let network: TestNetwork
  let agent: AtpAgent
  let sc: SeedClient
  let bob: { "did": string;  "handle": string; "password": string }
  
  beforeAll(async () => {
    network = await TestNetwork.create({ "dbPostgresSchema": "step_actor_likes" })
    agent = network.pds.getClient()
    sc = network.getSeedClient()    
    await usersSeed(sc)
    // Create a post as Alice and like it as Bob
    await sc.post(sc.dids.alice, "Dan Dan Noodle is my favorite meal")
    await sc.like(sc.dids.bob, sc.posts[sc.dids.alice][0].ref)
    await network.processAll()
    
    bob = sc.accounts[sc.dids.bob]
    await agent.login({ "identifier": bob.handle, "password": bob.password })
  })

  afterAll(async () => {
    // For some reason the AppView schema is not being dropped
    await network.bsky.db.db.schema.dropSchema("appview_step_actor_likes").cascade().execute()
    await network.close()
  })

  test("get user's likes", async () => {
    const likes = await Trotsky.init(agent).actor(bob.handle).likes().runHere()
    expect(likes.output).toBeInstanceOf(Array)
    expect(likes.output).toHaveLength(1)
  })
})