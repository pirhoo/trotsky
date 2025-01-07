import { afterAll, beforeAll, describe, expect, jest, test } from "@jest/globals"
import { AtpAgent } from "@atproto/api"
import { TestNetwork, SeedClient, usersSeed } from "@atproto/dev-env"

import { Trotsky, StepSearchPosts } from "../../lib/trotsky"

describe("StepSearchPosts", () => {
  let network: TestNetwork
  let agent: AtpAgent
  let sc: SeedClient

  beforeAll(async () => {
    network = await TestNetwork.create({ "dbPostgresSchema": "step_search_posts" })
    agent = network.bsky.getClient()  
    sc = network.getSeedClient()
    await usersSeed(sc)
    await sc.post(sc.dids.bob, "I hate football")
    await sc.post(sc.dids.bob, "I love food")
    await network.processAll()
  })

  afterAll(async () => {
    // For some reason the AppView schema is not being dropped
    await network.bsky.db.db.schema.dropSchema("appview_step_search_posts").cascade().execute()
    await network.close()
  })

  test("clones it", () => {
    const clone = new StepSearchPosts(agent, null, { "q": "bar" }).clone()
    expect(clone).toBeInstanceOf(StepSearchPosts)
    expect(clone).toHaveProperty("_queryParams", expect.objectContaining({ "q": "bar" }))
  })

  test("search 2 posts for \"foo\"", async () => {
    const posts = await Trotsky.init(agent).searchPosts({ "q": "foo" }).runHere()
    expect(posts).toBeInstanceOf(StepSearchPosts)
    expect(posts.output).toBeInstanceOf(Array)
    expect(posts.output).toHaveLength(2)
  })

  test("search 1 post for \"love\"", async () => {
    const posts = await Trotsky.init(agent).searchPosts({ "q": "love" }).runHere()
    expect(posts).toBeInstanceOf(StepSearchPosts)
    expect(posts.output).toBeInstanceOf(Array)
    expect(posts.output).toHaveLength(1)
  })
})