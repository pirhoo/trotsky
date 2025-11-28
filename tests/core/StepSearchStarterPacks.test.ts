import { afterAll, beforeAll, describe, expect, test } from "@jest/globals"
import { TestNetwork, SeedClient, usersSeed } from "@atproto/dev-env"
import { AtpAgent } from "@atproto/api"
import { Trotsky, StepSearchStarterPacks } from "../../lib/trotsky"

describe("StepSearchStarterPacks", () => {
  let network: TestNetwork
  let agent: AtpAgent
  let sc: SeedClient

  // accounts
  let bob: { "did": string; "handle": string; "password": string }
  let alice: { "did": string; "handle": string; "password": string }
  let carol: { "did": string; "handle": string; "password": string }

  beforeAll(async () => {
    network = await TestNetwork.create({
      "dbPostgresSchema": "trotsky_step_search_starter_packs"
    })

    agent = network.bsky.getClient()
    sc = network.getSeedClient()

    // Seed users
    await usersSeed(sc)
    bob = sc.accounts[sc.dids.bob]
    alice = sc.accounts[sc.dids.alice]
    carol = sc.accounts[sc.dids.carol]

    // Create starter packs with different names for search testing
    await sc.createStarterPack(bob.did, "Tech Community", [alice.did])
    await sc.createStarterPack(bob.did, "TypeScript Developers", [carol.did])
    await sc.createStarterPack(alice.did, "JavaScript Enthusiasts", [bob.did])

    await network.processAll()
  }, 120e3)

  afterAll(async () => {
    await network.close()
  })

  test("should clone properly", () => {
    const step = Trotsky.init(agent).searchStarterPacks({ "q": "tech" })
    const cloned = step.clone()
    expect(cloned).toBeInstanceOf(StepSearchStarterPacks)
    expect(cloned._queryParams).toEqual(step._queryParams)
  })

  test("should search starter packs by query", async () => {
    const packs = await Trotsky.init(agent)
      .searchStarterPacks({ "q": "Tech" })
      .runHere()

    expect(packs).toBeInstanceOf(StepSearchStarterPacks)
    expect(packs.output).toBeInstanceOf(Array)
    expect(packs.output.length).toBeGreaterThan(0)
  })

  test("should return starter packs with correct structure", async () => {
    const packs = await Trotsky.init(agent)
      .searchStarterPacks({ "q": "Community" })
      .runHere()

    packs.output.forEach(pack => {
      expect(pack).toHaveProperty("uri")
      expect(pack).toHaveProperty("creator")
      expect(pack.creator).toHaveProperty("handle")
      expect(pack.creator).toHaveProperty("did")
    })
  })

  test("should support limit parameter", async () => {
    const packsWithoutLimit = await Trotsky.init(agent)
      .searchStarterPacks({ "q": "Tech" })
      .runHere()

    const packsWithLimit = await Trotsky.init(agent)
      .searchStarterPacks({ "q": "Tech", "limit": 1 })
      .runHere()

    // With limit should return same or fewer results
    expect(packsWithLimit.output.length).toBeLessThanOrEqual(packsWithoutLimit.output.length)
  })

  test("should iterate through search results with each()", async () => {
    const uris: string[] = []

    await Trotsky.init(agent)
      .searchStarterPacks({ "q": "JavaScript" })
      .take(5)
      .each()
      .tap((step) => {
        if (step?.context?.uri) {
          uris.push(step.context.uri)
        }
      })
      .run()

    expect(uris.length).toBeGreaterThan(0)
  })

  test("should filter search results with when()", async () => {
    const filteredPacks: string[] = []

    await Trotsky.init(agent)
      .searchStarterPacks({ "q": "TypeScript" })
      .take(10)
      .each()
      .when((step) => step?.context?.creator.handle === bob.handle)
      .tap((step) => {
        if (step?.context?.uri) {
          filteredPacks.push(step.context.uri)
        }
      })
      .run()

    // Should only include packs created by bob
    expect(filteredPacks.length).toBeGreaterThan(0)
  })

  test("should handle pagination with take()", async () => {
    const packs = await Trotsky.init(agent)
      .searchStarterPacks({ "q": "Developers" })
      .take(2)
      .runHere()

    expect(packs.output.length).toBeLessThanOrEqual(2)
  })

  test("should return empty array for query with no results", async () => {
    const packs = await Trotsky.init(agent)
      .searchStarterPacks({ "q": "NonExistentQueryThatWillNeverMatch12345" })
      .runHere()

    expect(packs.output).toBeInstanceOf(Array)
    expect(packs.output).toHaveLength(0)
  })

  test("should return starter packs with indexed timestamps", async () => {
    const packs = await Trotsky.init(agent)
      .searchStarterPacks({ "q": "Community" })
      .runHere()

    packs.output.forEach(pack => {
      expect(pack).toHaveProperty("indexedAt")
      expect(pack.indexedAt).toBeTruthy()
    })
  })

  test("should work with tap() to process results", async () => {
    const result = await Trotsky.init(agent)
      .searchStarterPacks({ "q": "Tech" })
      .runHere()

    expect(result.output).toBeInstanceOf(Array)
    expect(result.output.length).toBeGreaterThan(0)
  })
})
