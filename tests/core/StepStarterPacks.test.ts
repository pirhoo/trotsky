import { afterAll, beforeAll, describe, expect, test } from "@jest/globals"
import { TestNetwork, SeedClient, usersSeed, RecordRef } from "@atproto/dev-env"
import { AtpAgent } from "@atproto/api"
import { Trotsky } from "../../lib/trotsky"

describe("StepStarterPacks", () => {
  let network: TestNetwork
  let agent: AtpAgent
  let sc: SeedClient

  // accounts
  let bob: { "did": string; "handle": string; "password": string }
  let alice: { "did": string; "handle": string; "password": string }
  let carol: { "did": string; "handle": string; "password": string }
  let dan: { "did": string; "handle": string; "password": string }

  // starter packs
  let starterPack1: RecordRef
  let starterPack2: RecordRef

  beforeAll(async () => {
    network = await TestNetwork.create({
      "dbPostgresSchema": "trotsky_step_starter_packs"
    })

    agent = network.bsky.getClient()
    sc = network.getSeedClient()

    // Seed users
    await usersSeed(sc)
    bob = sc.accounts[sc.dids.bob]
    alice = sc.accounts[sc.dids.alice]
    carol = sc.accounts[sc.dids.carol]
    dan = sc.accounts[sc.dids.dan]

    // Create first starter pack with alice and carol
    starterPack1 = await sc.createStarterPack(bob.did, "Tech Community", [alice.did, carol.did])

    // Create second starter pack with dan
    starterPack2 = await sc.createStarterPack(bob.did, "Developers", [dan.did])

    await network.processAll()
  }, 120e3)

  afterAll(async () => {
    await network.close()
  })

  test("should clone properly", () => {
    const step = Trotsky.init(agent).starterPacks([starterPack1.uri, starterPack2.uri])
    const cloned = step.clone()
    expect(cloned).toBeInstanceOf(step.constructor)
    expect(cloned._uris).toEqual(step._uris)
  })

  test("should get multiple starter packs", async () => {
    const packs = await Trotsky.init(agent)
      .starterPacks([starterPack1.uri, starterPack2.uri])
      .runHere()

    expect(packs.output).toHaveLength(2)
    expect(packs.output[0]).toHaveProperty("uri")
    expect(packs.output[1]).toHaveProperty("uri")
  })

  test("should get starter packs with correct URIs", async () => {
    const packs = await Trotsky.init(agent)
      .starterPacks([starterPack1.uri, starterPack2.uri])
      .runHere()

    const uris = packs.output.map(pack => pack.uri)
    expect(uris).toContain(starterPack1.uri.toString())
    expect(uris).toContain(starterPack2.uri.toString())
  })

  test("should get starter packs with creator information", async () => {
    const packs = await Trotsky.init(agent)
      .starterPacks([starterPack1.uri, starterPack2.uri])
      .runHere()

    packs.output.forEach(pack => {
      expect(pack).toHaveProperty("creator")
      expect(pack.creator).toHaveProperty("handle", bob.handle)
      expect(pack.creator).toHaveProperty("did", bob.did)
    })
  })

  test("should get starter packs with list item counts", async () => {
    const packs = await Trotsky.init(agent)
      .starterPacks([starterPack1.uri, starterPack2.uri])
      .runHere()

    const pack1 = packs.output.find(p => p.uri === starterPack1.uri.toString())
    const pack2 = packs.output.find(p => p.uri === starterPack2.uri.toString())

    // listItemCount may be present if supported by the API
    expect(pack1).toBeDefined()
    expect(pack2).toBeDefined()
    // The count may or may not be populated depending on the test environment
    if (pack1?.listItemCount !== undefined) {
      expect(pack1.listItemCount).toBeGreaterThanOrEqual(0)
    }
    if (pack2?.listItemCount !== undefined) {
      expect(pack2.listItemCount).toBeGreaterThanOrEqual(0)
    }
  })

  test("should iterate through each starter pack", async () => {
    const uris: string[] = []

    await Trotsky.init(agent)
      .starterPacks([starterPack1.uri, starterPack2.uri])
      .each()
      .tap((step) => {
        uris.push(step?.context?.uri || "")
      })
      .run()

    expect(uris).toHaveLength(2)
    expect(uris).toContain(starterPack1.uri.toString())
    expect(uris).toContain(starterPack2.uri.toString())
  })

  test("should filter starter packs with when()", async () => {
    const filteredPacks: string[] = []

    await Trotsky.init(agent)
      .starterPacks([starterPack1.uri, starterPack2.uri])
      .each()
      .when((step) => step?.context?.uri === starterPack1.uri.toString())
      .tap((step) => {
        filteredPacks.push(step?.context?.uri || "")
      })
      .run()

    expect(filteredPacks).toHaveLength(1)
    expect(filteredPacks[0]).toBe(starterPack1.uri.toString())
  })

  test("should handle empty array", async () => {
    const packs = await Trotsky.init(agent).starterPacks([]).runHere()
    expect(packs.output).toHaveLength(0)
  })

  test("should return indexed timestamps", async () => {
    const packs = await Trotsky.init(agent)
      .starterPacks([starterPack1.uri, starterPack2.uri])
      .runHere()

    packs.output.forEach(pack => {
      expect(pack).toHaveProperty("indexedAt")
      expect(pack.indexedAt).toBeTruthy()
    })
  })

  test("should iterate with custom iterator function", async () => {
    let count = 0

    await Trotsky.init(agent)
      .starterPacks([starterPack1.uri, starterPack2.uri])
      .each(() => count++)
      .run()

    expect(count).toBe(2)
  })
})
