import { afterAll, beforeAll, describe, expect, test } from "@jest/globals"
import { TestNetwork, SeedClient, usersSeed } from "@atproto/dev-env"
import { AtpAgent } from "@atproto/api"
import { Trotsky, StepActorStarterPacks } from "../../lib/trotsky"

describe("StepActorStarterPacks", () => {
  let network: TestNetwork
  let agent: AtpAgent
  let sc: SeedClient

  // accounts
  let bob: { "did": string; "handle": string; "password": string }
  let alice: { "did": string; "handle": string; "password": string }
  let carol: { "did": string; "handle": string; "password": string }

  // starter packs
  let starterPack1: { "uri": string; "cid": string }
  let starterPack2: { "uri": string; "cid": string }

  beforeAll(async () => {
    network = await TestNetwork.create({
      "dbPostgresSchema": "trotsky_step_actor_starter_packs"
    })

    agent = network.bsky.getClient()
    sc = network.getSeedClient()

    // Seed users
    await usersSeed(sc)
    bob = sc.accounts[sc.dids.bob]
    alice = sc.accounts[sc.dids.alice]
    carol = sc.accounts[sc.dids.carol]

    // Create starter packs for bob
    starterPack1 = await sc.createStarterPack(bob.did, "Tech Community", [alice.did])
    starterPack2 = await sc.createStarterPack(bob.did, "JavaScript Enthusiasts", [carol.did])

    // Create a starter pack for alice (to test filtering)
    await sc.createStarterPack(alice.did, "Alice's Pack", [bob.did])

    await network.processAll()
  }, 120e3)

  afterAll(async () => {
    await network.close()
  })

  test("should clone properly", () => {
    const step = Trotsky.init(agent).actor(bob.handle).starterPacks()
    const cloned = step.clone()
    expect(cloned).toBeInstanceOf(StepActorStarterPacks)
  })

  test("should get actor's starter packs", async () => {
    const packs = await Trotsky.init(agent)
      .actor(bob.handle)
      .starterPacks()
      .runHere()

    expect(packs).toBeInstanceOf(StepActorStarterPacks)
    expect(packs.output).toBeInstanceOf(Array)
    expect(packs.output.length).toBe(2)
  })

  test("should return starter packs with correct structure", async () => {
    const packs = await Trotsky.init(agent)
      .actor(bob.handle)
      .starterPacks()
      .runHere()

    packs.output.forEach(pack => {
      expect(pack).toHaveProperty("uri")
      expect(pack).toHaveProperty("creator")
      expect(pack.creator).toHaveProperty("handle")
      expect(pack.creator).toHaveProperty("did")
      expect(pack.creator.did).toBe(bob.did)
    })
  })

  test("should verify URIs match created packs", async () => {
    const packs = await Trotsky.init(agent)
      .actor(bob.handle)
      .starterPacks()
      .runHere()

    const uris = packs.output.map(p => p.uri)
    expect(uris).toContain(starterPack1.uri.toString())
    expect(uris).toContain(starterPack2.uri.toString())
  })

  test("should iterate through each starter pack", async () => {
    const uris: string[] = []

    await Trotsky.init(agent)
      .actor(bob.handle)
      .starterPacks()
      .each()
      .tap((step) => {
        if (step?.context?.uri) {
          uris.push(step.context.uri)
        }
      })
      .run()

    expect(uris).toHaveLength(2)
    expect(uris).toContain(starterPack1.uri.toString())
    expect(uris).toContain(starterPack2.uri.toString())
  })

  test("should filter starter packs with when()", async () => {
    const filteredPacks: string[] = []

    await Trotsky.init(agent)
      .actor(bob.handle)
      .starterPacks()
      .each()
      .when((step) => step?.context?.uri === starterPack1.uri.toString())
      .tap((step) => {
        if (step?.context?.uri) {
          filteredPacks.push(step.context.uri)
        }
      })
      .run()

    expect(filteredPacks).toHaveLength(1)
    expect(filteredPacks[0]).toBe(starterPack1.uri.toString())
  })

  test("should handle pagination with take()", async () => {
    const packs = await Trotsky.init(agent)
      .actor(bob.handle)
      .starterPacks()
      .take(1)
      .runHere()

    expect(packs.output.length).toBeLessThanOrEqual(1)
  })

  test("should return empty array for actor with no packs", async () => {
    const packs = await Trotsky.init(agent)
      .actor(carol.handle)
      .starterPacks()
      .runHere()

    expect(packs.output).toBeInstanceOf(Array)
    expect(packs.output).toHaveLength(0)
  })

  test("should return indexed timestamps", async () => {
    const packs = await Trotsky.init(agent)
      .actor(bob.handle)
      .starterPacks()
      .runHere()

    packs.output.forEach(pack => {
      expect(pack).toHaveProperty("indexedAt")
      expect(pack.indexedAt).toBeTruthy()
    })
  })

  test("should work with tap() to process results", async () => {
    const result = await Trotsky.init(agent)
      .actor(bob.handle)
      .starterPacks()
      .runHere()

    expect(result.output).toBeInstanceOf(Array)
    expect(result.output.length).toBeGreaterThan(0)
  })

  test("should throw error when no context is available", async () => {
    const step = new StepActorStarterPacks(agent, null)

    await expect(async () => {
      await step.applyPagination()
    }).rejects.toThrow("No context found for StepActorStarterPacks")
  })
})
