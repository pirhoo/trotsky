import { afterAll, beforeAll, describe, expect, test } from "@jest/globals"
import { AtpAgent } from "@atproto/api"
import { TestNetwork, SeedClient, usersSeed, RecordRef } from "@atproto/dev-env"

import { Trotsky } from "../../lib/trotsky"

describe("StepListMembers", () => {
  let network: TestNetwork
  let agent: AtpAgent
  let sc: SeedClient
  let alice: { "did": string; "handle": string; "password": string }
  let bob: { "did": string; "handle": string; "password": string }
  let friends: RecordRef
  
  beforeAll(async () => {
    network = await TestNetwork.create({ "dbPostgresSchema": "step_list_members" })
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
    await network.bsky.db.db.schema.dropSchema("appview_step_list_members").cascade().execute()
    await network.close()
  })

  test("should get a list's members", async () => {
    const list = await Trotsky.init(agent).list(friends.uri)
    const members = await list.members().runHere()
    expect(members.output).toHaveLength(1)
    expect(members.output[0]).toHaveProperty("did", alice.did)
  })
})