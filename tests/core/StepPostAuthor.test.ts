import { afterAll, beforeAll, describe, expect, test } from "@jest/globals"
import { AtpAgent } from "@atproto/api"
import { TestNetwork, SeedClient, usersSeed, RecordRef } from "@atproto/dev-env"

import { Trotsky } from "../../lib/trotsky"

describe("StepPostLike", () => {
  let network: TestNetwork
  let agent: AtpAgent
  let sc: SeedClient
  let postRef: RecordRef
  
  beforeAll(async () => {
    network = await TestNetwork.create({ "dbPostgresSchema": "step_post_author" })    
    sc = network.getSeedClient()    
    await usersSeed(sc)
    await sc.post(sc.dids.bob, "Dan Dan Noodle is my favorite meal")    
    await network.processAll()
    postRef = sc.posts[sc.dids.bob][0].ref
    agent = network.bsky.getClient()
  })

  afterAll(async () => {
    // For some reason the AppView schema is not being dropped
    await network.bsky.db.db.schema.dropSchema("appview_step_post_author").cascade().execute()
    await network.close()
  })

  test("get the author's profile", async () => {
    /* eslint-disable @stylistic/ts/indent */
    const author = await Trotsky
      .init(agent)
      .post(postRef.uri)
        .author()
        .runHere()
    /* eslint-enable @stylistic/ts/indent */
    expect(author.output).toHaveProperty("did", sc.dids.bob)  
    expect(author.output).toHaveProperty("followersCount", 0)  
    expect(author.output).toHaveProperty("followsCount", 0)  
  })

  test("get the author's posts'", async () => {
    /* eslint-disable @stylistic/ts/indent */
    const posts = await Trotsky
      .init(agent)
      .post(postRef.uri)
        .author()
        .posts()        
        .runHere()
    /* eslint-enable @stylistic/ts/indent */
    expect(posts.output).toHaveLength(1)
  })
})