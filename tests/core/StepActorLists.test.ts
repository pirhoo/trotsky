import { afterAll, beforeAll, describe, expect, test } from "@jest/globals"
import { AtpAgent } from "@atproto/api"
import { TestNetwork, SeedClient, usersSeed, RecordRef } from "@atproto/dev-env"

import { Trotsky } from "../../lib/trotsky"

describe("StepList", () => {
  let network: TestNetwork
  let agent: AtpAgent
  let sc: SeedClient
  let alice: { "did": string; "handle": string; "password": string }
  let bob: { "did": string; "handle": string; "password": string }
  let friends: RecordRef
  
  beforeAll(async () => {
    network = await TestNetwork.create({ "dbPostgresSchema": "step_actor_lists" })
    agent = network.bsky.getClient()  
    sc = network.getSeedClient()
    // Seed users
    await usersSeed(sc)
    bob = sc.accounts[sc.dids.bob]
    alice = sc.accounts[sc.dids.alice]
    // Seed list
    friends = await sc.createList(bob.did, "Bob's friends", "curate")
    // Add Alice to the list
    await sc.addToList(bob.did, alice.did, friends)
    await network.processAll()
  })

  afterAll(async () => {
    // For some reason the AppView schema is not being dropped
    await network.bsky.db.db.schema.dropSchema("appview_step_actor_lists").cascade().execute()
    await network.close()
  })

  test("should get Bob's lists", async () => {
    await expect(Trotsky.init(agent).actor(bob.did).lists().run()).resolves.not.toThrow()
  })
  
  test("should get a list's name", async () => {
    const lists = await Trotsky.init(agent).actor(bob.did).lists().runHere()
    expect(lists.output).toHaveLength(1)
    expect(lists.output[0]).toHaveProperty("name", "Bob's friends")
  })
})