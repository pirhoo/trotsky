import { afterAll, beforeAll, describe, expect, test } from "@jest/globals"
import { AtpAgent } from "@atproto/api"
import { TestNetwork, SeedClient, usersSeed, RecordRef } from "@atproto/dev-env"

import { StepStarterPack, Trotsky } from "../../lib/trotsky"

describe("StepStarterPack", () => {
  let network: TestNetwork
  let agent: AtpAgent
  let sc: SeedClient
  let alice: { "did": string; "handle": string; "password": string }
  let bob: { "did": string; "handle": string; "password": string }
  let carol: { "did": string; "handle": string; "password": string }
  let starterPack: RecordRef

  beforeAll(async () => {
    network = await TestNetwork.create({ "dbPostgresSchema": "step_starter_pack" })
    agent = network.bsky.getClient()
    sc = network.getSeedClient()
    // Seed users
    await usersSeed(sc)
    bob = sc.accounts[sc.dids.bob]
    alice = sc.accounts[sc.dids.alice]
    carol = sc.accounts[sc.dids.carol]
    // Create a starter pack with Alice and Carol as members
    starterPack = await sc.createStarterPack(bob.did, "Bob's Starter Pack", [alice.did, carol.did])
    await network.processAll()
  })

  afterAll(async () => {
    // For some reason the AppView schema is not being dropped
    await network.bsky.db.db.schema.dropSchema("appview_step_starter_pack").cascade().execute()
    await network.close()
  })

  test("clones it", () => {
    const clone = new StepStarterPack(agent, null, "at://did/repo/rkey").clone()
    expect(clone).toBeInstanceOf(StepStarterPack)
    expect(clone).toHaveProperty("_uri", "at://did/repo/rkey")
  })

  test("should get a starter pack", async () => {
    await expect(Trotsky.init(agent).starterPack(starterPack.uri).run()).resolves.not.toThrow()
  })

  test("should get a starter pack's creator", async () => {
    const pack = await Trotsky.init(agent).starterPack(starterPack.uri).runHere()
    expect(pack.output).toHaveProperty("creator")
    expect(pack.output.creator).toHaveProperty("handle", bob.handle)
  })

  test("should get a starter pack's URI", async () => {
    const pack = await Trotsky.init(agent).starterPack(starterPack.uri).runHere()
    expect(pack.output).toHaveProperty("uri")
    expect(pack.output.uri).toBe(starterPack.uri.toString())
  })

  test("should get a starter pack with list items", async () => {
    const pack = await Trotsky.init(agent).starterPack(starterPack.uri).runHere()
    expect(pack.output).toHaveProperty("listItemsSample")
    expect(pack.output.listItemsSample).toBeInstanceOf(Array)
  })

  test("should have list items sample with expected members", async () => {
    const pack = await Trotsky.init(agent).starterPack(starterPack.uri).runHere()
    const handles = pack.output.listItemsSample?.map(item => item.subject.handle) || []
    expect(handles).toContain(alice.handle)
    expect(handles).toContain(carol.handle)
  })

  test("should get a starter pack with indexed timestamp", async () => {
    const pack = await Trotsky.init(agent).starterPack(starterPack.uri).runHere()
    expect(pack.output).toHaveProperty("indexedAt")
    expect(typeof pack.output.indexedAt).toBe("string")
  })

  test("should get a starter pack with CID", async () => {
    const pack = await Trotsky.init(agent).starterPack(starterPack.uri).runHere()
    expect(pack.output).toHaveProperty("cid")
    expect(typeof pack.output.cid).toBe("string")
  })

  test("should get a starter pack with record", async () => {
    const pack = await Trotsky.init(agent).starterPack(starterPack.uri).runHere()
    expect(pack.output).toHaveProperty("record")
    expect(typeof pack.output.record).toBe("object")
  })

  test("should handle non-existent starter pack gracefully", async () => {
    const fakeUri = "at://did:plc:fake/app.bsky.graph.starterpack/fake"
    await expect(Trotsky.init(agent).starterPack(fakeUri).run()).rejects.toThrow()
  })
})
