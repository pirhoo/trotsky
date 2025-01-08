import { afterAll, beforeAll, describe, expect, test } from "@jest/globals"
import { AtpAgent } from "@atproto/api"
import { TestNetwork, SeedClient, usersSeed } from "@atproto/dev-env"

import { StepPosts, Trotsky } from "../../lib/trotsky"

describe("StepPosts", () => {
  let network: TestNetwork
  let agent: AtpAgent
  let sc: SeedClient
  
  beforeAll(async () => {
    network = await TestNetwork.create({ "dbPostgresSchema": "step_posts" })
    agent = network.bsky.getClient()    
    sc = network.getSeedClient()
    await usersSeed(sc)
    await sc.post(sc.dids.bob, "Dan Dan Noodle is my favorite meal")    
    await sc.post(sc.dids.bob, "Kimchi is a traditional Korean side dish made of fermented vegetables") 
    await network.processAll()
  })

  afterAll(async () => {
    // For some reason the AppView schema is not being dropped
    await network.bsky.db.db.schema.dropSchema("appview_step_posts").cascade().execute()
    await network.close()
  })

  test("clone it", () => {
    const uris = sc.posts[sc.dids.bob].map(({ "ref": { uri } }) => uri)
    const posts = Trotsky.init(agent).posts(uris)
    const clone = posts.clone()
    expect(clone).toBeInstanceOf(StepPosts)
    expect(clone).toHaveProperty("_uris", uris)
  })

  test("get the posts", async () => {
    const uris = sc.posts[sc.dids.bob].map(({ "ref": { uri } }) => uri)
    const post = await Trotsky.init(agent).posts(uris).runHere()
    expect(post.output).toHaveLength(2)
  })
})