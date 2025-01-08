import { afterAll, beforeAll, describe, expect, test } from "@jest/globals"
import { AtpAgent } from "@atproto/api"
import { TestNetwork, SeedClient, usersSeed, RecordRef } from "@atproto/dev-env"

import { StepList, StepListMembers, StepWhen, Trotsky } from "../../lib/trotsky"

describe("StepList", () => {
  let network: TestNetwork
  let agent: AtpAgent
  let sc: SeedClient
  let alice: { "did": string; "handle": string; "password": string }
  let bob: { "did": string; "handle": string; "password": string }
  let friends: RecordRef
  
  beforeAll(async () => {
    network = await TestNetwork.create({ "dbPostgresSchema": "step_list" })
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
    await network.bsky.db.db.schema.dropSchema("appview_step_list").cascade().execute()
    await network.close()
  })

  test("clones it", () => {
    const clone = new StepList(agent, null, "at://did/repo/rkey").clone()
    expect(clone).toBeInstanceOf(StepList)
    expect(clone).toHaveProperty("_uri", "at://did/repo/rkey")
  })

  test("clones its child steps", () => {
    const list = new StepList(agent, null, "at://did/repo/rkey")
    const clone = list.members().back().clone()
    expect(clone.steps).toHaveLength(1)
    expect(clone.steps[0]).toBeInstanceOf(StepListMembers)
    expect(clone.steps[0]).toHaveProperty("_parent", clone)
  })

  test("clones its grand-child steps", () => {
    const trotsky = Trotsky.init(agent).list("at://did/repo/rkey").members().when(true).end()
    const clone = trotsky.clone()
    expect(clone.steps).toHaveLength(1)
    expect(clone.steps[0]).toBeInstanceOf(StepList)
    expect(clone.flattenSteps).toHaveLength(3)
    expect(clone.flattenSteps[0]).toBeInstanceOf(StepList)
    expect(clone.flattenSteps[1]).toBeInstanceOf(StepListMembers)
    expect(clone.flattenSteps[2]).toBeInstanceOf(StepWhen)
  })

  test("clones its grand-child steps with the same config", () => {
    const trotsky = Trotsky.init(agent).config("foo", "foo").list("at://did/repo/rkey").end()
    const clone = trotsky.clone()
    expect(trotsky.config("foo")).toBe("foo")
    expect(clone.config("foo")).toBe("foo")
  })

  test("clones its grand-child steps with the same config but a unqiue reference", () => {
    const trotsky = Trotsky.init(agent).config("foo", "foo").list("at://did/repo/rkey").end()
    const clone = trotsky.clone()
    clone.config("foo", "changed")
    expect(trotsky.config("foo")).toBe("foo")
    expect(clone.config("foo")).toBe("changed")
  })

  test("should get a list", async () => {
    await expect(Trotsky.init(agent).list(friends.uri).run()).resolves.not.toThrow()
  })
  
  test("should get a list's name", async () => {
    const list = await Trotsky.init(agent).list(friends.uri).runHere()
    expect(list.output).toHaveProperty("name", "Bob's friends")
  })
})