import { afterAll, beforeAll, describe, expect, test } from "@jest/globals"
import { AtpAgent } from "@atproto/api"
import { TestNetwork, SeedClient, usersSeed } from "@atproto/dev-env"

import { Trotsky } from "../../lib/trotsky"

describe("StepPost", () => {
  let network: TestNetwork
  let agent: AtpAgent
  let sc: SeedClient
  let bob: { "did": string; "handle": string; "password": string }
  
  beforeAll(async () => {
    network = await TestNetwork.create({ "dbPostgresSchema": "step_post" })
    agent = network.pds.getClient()    
    sc = network.getSeedClient()
    await usersSeed(sc) 
    bob = sc.accounts[sc.dids.bob]
    await network.processAll()
    await agent.login({ "identifier": bob.handle, "password": bob.password })
  })

  afterAll(async () => {
    // For some reason the AppView schema is not being dropped
    await network.bsky.db.db.schema.dropSchema("appview_step_post").cascade().execute()
    await network.close()
  })

  test("create a post", async () => {
    const post = Trotsky.init(agent).createPost({ "text": "Dan Dan Noodle is my favorite meal" })
    await post.run()
    expect(post.output).toHaveProperty("uri")
    expect(post.output).toHaveProperty("cid")
  })
})