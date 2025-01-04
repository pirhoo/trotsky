import { afterAll, beforeAll, describe, expect, test } from "@jest/globals"
import { AtpAgent } from "@atproto/api"
import { TestNetwork, SeedClient, usersSeed, RecordRef } from "@atproto/dev-env"

import { Trotsky } from "../../lib/trotsky"

describe("StepPostRepost", () => {
  let network: TestNetwork
  let agentPds: AtpAgent
  let agentBksy: AtpAgent
  let sc: SeedClient
  let postRef: RecordRef
  let bob: { "did": string; "handle": string; "password": string }
  
  beforeAll(async () => {
    network = await TestNetwork.create({ "dbPostgresSchema": "step_post_repost" })
    
    sc = network.getSeedClient()    
    await usersSeed(sc)
    await sc.post(sc.dids.bob, "Dan Dan Noodle is my favorite meal")    
    await network.processAll()

    bob = sc.accounts[sc.dids.bob]
    postRef = sc.posts[sc.dids.bob][0].ref

    // Use PDS agent for authenticated queries on the PDS
    agentPds = network.pds.getClient()    
    // Use BSKY agent for non-authenticated queries on the BSKY
    agentBksy = network.bsky.getClient()

    await agentPds.login({ "identifier": bob.handle, "password": bob.password })
  })

  afterAll(async () => {
    // For some reason the AppView schema is not being dropped
    await network.bsky.db.db.schema.dropSchema("appview_step_post_repost").cascade().execute()
    await network.close()
  })

  test("repost the post without throwing an exception", async () => {
    /* eslint-disable @stylistic/ts/indent */
    const repost = Trotsky
      .init(agentBksy)
      .post(postRef.uri)
        .repost()
        .withAgent(agentPds)
    /* eslint-enable @stylistic/ts/indent */    
    await expect(repost.run()).resolves.not.toThrow()
  })


  test("repost the post and save output", async () => {
    /* eslint-disable @stylistic/ts/indent */
    const repost = Trotsky
      .init(agentBksy)
      .post(postRef.uri)
        .repost()
        .withAgent(agentPds)
    /* eslint-enable @stylistic/ts/indent */    
    await repost.run()
    
    expect(repost.output).toHaveProperty("cid")
    expect(repost.output).toHaveProperty("uri")
  })
})