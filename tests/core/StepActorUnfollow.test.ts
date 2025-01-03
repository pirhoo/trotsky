import { afterAll, beforeAll, describe, expect, test } from "@jest/globals"
import { AtpAgent } from "@atproto/api"
import { TestNetwork, SeedClient, usersSeed } from "@atproto/dev-env"

import { Trotsky } from "../../lib/trotsky"

describe("StepActorUnfollow", () => {
  let network: TestNetwork
  let agent: AtpAgent
  let sc: SeedClient
  let alice: { "did": string; "handle": string; "password": string }
  let carol: { "did": string; "handle": string; "password": string }
  let bob: { "did": string; "handle": string; "password": string }
  
  beforeAll(async () => {
    network = await TestNetwork.create({ "dbPostgresSchema": "step_actor_unfollow" })
    agent = network.pds.getClient()
    
    sc = network.getSeedClient()
    await usersSeed(sc)
    await sc.follow(sc.dids.bob, sc.dids.alice)

    bob = sc.accounts[sc.dids.bob]
    alice = sc.accounts[sc.dids.alice]
    carol = sc.accounts[sc.dids.carol]

    await network.processAll()
    await agent.login({ "identifier": bob.handle, "password": bob.password })
  })

  afterAll(async () => {
    await network.close()
  })

  test("unfollow Alice", async () => {
    await Trotsky.init(agent).actor(alice.handle).unfollow().wait(1e2).run()
    await network.processAll()
    const actor = bob.did
    const others = [alice.did]
    const { "data": { relationships } } = await agent.app.bsky.graph.getRelationships({ actor, others })
    
    expect(relationships).toEqual(
      expect.arrayContaining([
        expect.not.objectContaining({ 
          "did": alice.did,
          "following": expect.any(String)
        })
      ])
    )

  })

  test("unfollow Carol does nothing even she is not followed", async () => {
    await expect(Trotsky.init(agent).actor(carol.handle).unfollow().run()).resolves.not.toThrow()
  })
})