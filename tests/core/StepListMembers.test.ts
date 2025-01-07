import { afterAll, beforeAll, describe, expect, test } from "@jest/globals"
import { AtpAgent } from "@atproto/api"
import { TestNetwork, SeedClient, usersSeed, RecordRef } from "@atproto/dev-env"

import { StepListMembers, Trotsky } from "../../lib/trotsky"

describe("StepListMembers", () => {
  let network: TestNetwork
  let agent: AtpAgent
  let sc: SeedClient
  let alice: { "did": string; "handle": string; "password": string }
  let bob: { "did": string; "handle": string; "password": string }
  let friends: RecordRef
  
  beforeAll(async () => {
    network = await TestNetwork.create({ "dbPostgresSchema": "step_list_members" })
    agent = network.pds.getClient()  
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
    // Login as Bob
    await agent.login({ "identifier": bob.handle, "password": bob.password })
  })

  afterAll(async () => {
    // For some reason the AppView schema is not being dropped
    await network.bsky.db.db.schema.dropSchema("appview_step_list_members").cascade().execute()
    await network.close()
  })

  test("clones it", () => {
    const list = Trotsky.init(agent).list(friends.uri)
    const members = list.members().take(10).skip(20)
    const clone = members.clone()
    expect(clone).toBeInstanceOf(StepListMembers)
    expect(clone).toHaveProperty("_parent", list)
    expect(clone).toHaveProperty("_take", 10)
    expect(clone).toHaveProperty("_skip", 20)
  })

  test("should get a list's members", async () => {
    const list = await Trotsky.init(agent).list(friends.uri)
    const members = await list.members().runHere()
    expect(members.output).toHaveLength(1)
    expect(members.output[0]).toHaveProperty("did", alice.did)
  })
})