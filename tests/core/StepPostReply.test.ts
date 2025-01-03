import { afterAll, beforeAll, describe, expect, test } from "@jest/globals"
import { AtpAgent } from "@atproto/api"
import { TestNetwork, SeedClient, usersSeed, RecordRef } from "@atproto/dev-env"

import { Trotsky } from "../../lib/trotsky"

describe("StepPostReply", () => {
  let network: TestNetwork
  let agentPds: AtpAgent
  let agentBksy: AtpAgent
  let sc: SeedClient
  let postRef: RecordRef
  let bob: { "did": string; "handle": string; "password": string }
  
  beforeAll(async () => {
    network = await TestNetwork.create({ "dbPostgresSchema": "step_post_reply" })
    
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
    await network.bsky.db.db.schema.dropSchema("appview_step_post_reply").cascade().execute()
    await network.close()
  })

  test("reply to the post", async () => {
    const reply = Trotsky
      .init(agentBksy)
      .post(postRef.uri)
      .reply({ "text": "I love it too!" })
      .withAgent(agentPds)
    
    await reply.run()

    expect(await reply.queryParams()).toHaveProperty("text", "I love it too!")
    expect(await reply.queryParams()).toHaveProperty("reply")
    expect(reply.output).toHaveProperty("cid")
  })
})