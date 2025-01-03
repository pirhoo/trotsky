import { afterAll, beforeAll, describe, expect, test } from "@jest/globals"
import { AtpAgent } from "@atproto/api"
import { TestNetwork, SeedClient, usersSeed } from "@atproto/dev-env"

import { Trotsky } from "../../lib/trotsky"

describe("StepActorUnblock", () => {
  let network: TestNetwork
  let agent: AtpAgent
  let sc: SeedClient
  let alice: { "did": string; "handle": string; "password": string }
  let carol: { "did": string; "handle": string; "password": string }
  let bob: { "did": string; "handle": string; "password": string }
  
  beforeAll(async () => {
    network = await TestNetwork.create({ "dbPostgresSchema": "step_actor_unblock" })
    agent = network.pds.getClient()
    
    sc = network.getSeedClient()
    await usersSeed(sc)
    await sc.block(sc.dids.bob, sc.dids.alice)

    bob = sc.accounts[sc.dids.bob]
    alice = sc.accounts[sc.dids.alice]
    carol = sc.accounts[sc.dids.carol]

    await network.processAll()
    await agent.login({ "identifier": bob.handle, "password": bob.password })
  })

  afterAll(async () => {
    await network.close()
  })

  test("unblock Alice", async () => {
    await Trotsky.init(agent).actor(alice.handle).unblock().wait(1e3).run()
    const { "data": { blocks } } = await agent.app.bsky.graph.getBlocks()
    expect(blocks).toHaveLength(0)
  })

  test("unblock Carol does nothing even she is not blocked", async () => {
    await Trotsky.init(agent).actor(carol.handle).unblock().wait(1e3).run()
    const { "data": { blocks } } = await agent.app.bsky.graph.getBlocks()
    expect(blocks).toHaveLength(0)
  })
})