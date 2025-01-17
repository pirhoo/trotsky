import { afterAll, beforeAll, describe, expect, test } from "@jest/globals"
import { AtpAgent } from "@atproto/api"
import { TestNetwork, SeedClient, usersSeed } from "@atproto/dev-env"

import { StepCreatePost, Trotsky } from "../../lib/trotsky"

describe("StepPost", () => {
  let network: TestNetwork
  let agent: AtpAgent
  let sc: SeedClient
  let bob: { "did": string; "handle": string; "password": string }
  
  beforeAll(async () => {
    network = await TestNetwork.create({ "dbPostgresSchema": "step_create_post" })
    agent = network.pds.getClient()    
    sc = network.getSeedClient()
    await usersSeed(sc) 
    bob = sc.accounts[sc.dids.bob]
    await network.processAll()
    await agent.login({ "identifier": bob.handle, "password": bob.password })
  })

  afterAll(async () => {
    // For some reason the AppView schema is not being dropped
    await network.bsky.db.db.schema.dropSchema("appview_step_create_post").cascade().execute()
    await network.close()
  })

  test("clones it", () => {
    const clone = new StepCreatePost(agent, null, { "text": "foo" }).clone()
    expect(clone).toBeInstanceOf(StepCreatePost)
    expect(clone).toHaveProperty("_record", expect.objectContaining({ "text": "foo" }))
  })

  test("create a post", async () => {
    const post = Trotsky.init(agent).createPost({ "text": "Dan Dan Noodle is my favorite meal" })
    await post.run()
    expect(post.output).toHaveProperty("uri")
    expect(post.output).toHaveProperty("cid")
  })

  test("create a post with a function", async () => {
    const post = Trotsky.init(agent).createPost(() => ({ "text": "Dan Dan Noodle is my favorite meal" }))
    await post.run()
    expect(post.output).toHaveProperty("uri")
    expect(post.output).toHaveProperty("cid")
  })

  test("create a post with a promise", async () => {
    const post = Trotsky.init(agent).createPost(async () => ({ "text": "Dan Dan Noodle is my favorite meal" }))
    await post.run()
    expect(post.output).toHaveProperty("uri")
    expect(post.output).toHaveProperty("cid")
  })
})