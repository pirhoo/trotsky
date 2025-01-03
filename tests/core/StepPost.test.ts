import { afterAll, beforeAll, describe, expect, test } from "@jest/globals"
import { AtpAgent } from "@atproto/api"
import { TestNetwork, SeedClient, usersSeed } from "@atproto/dev-env"

import { Trotsky } from "../../lib/trotsky"

describe("StepPost", () => {
  let network: TestNetwork
  let agent: AtpAgent
  let sc: SeedClient
  
  beforeAll(async () => {
    network = await TestNetwork.create({ "dbPostgresSchema": "step_post" })
    agent = network.bsky.getClient()    
    sc = network.getSeedClient()
    await usersSeed(sc)
    const post = await sc.post(sc.dids.bob, "Dan Dan Noodle is my favorite meal")    
    await sc.reply(sc.dids.alice, post.ref, post.ref, "Love it too!")    
    await network.processAll()
  })

  afterAll(async () => {
    // For some reason the AppView schema is not being dropped
    await network.bsky.db.db.schema.dropSchema("appview_step_post").cascade().execute()
    await network.close()
  })

  test("get the post", async () => {
    const { uri } = sc.posts[sc.dids.bob][0].ref
    const post = Trotsky.init(agent).post(uri)
    await post.run()
    expect(post.output).toHaveProperty("record")
    expect(post.output.record).toHaveProperty("text", "Dan Dan Noodle is my favorite meal")
  })

  test("get the reply", async () => {
    const { uri } = sc.replies[sc.dids.alice][0].ref
    const post = Trotsky.init(agent).post(uri)
    await post.run()
    expect(post.output).toHaveProperty("record")
    expect(post.output.record).toHaveProperty("text", "Love it too!")
    expect(post.output.record).toHaveProperty("reply")
  })
})