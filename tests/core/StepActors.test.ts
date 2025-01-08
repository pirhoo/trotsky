import { afterAll, beforeAll, describe, expect, jest, test } from "@jest/globals"
import { AtpAgent } from "@atproto/api"
import { TestNetwork, SeedClient, usersSeed } from "@atproto/dev-env"
import { StepActors, Trotsky } from "../../lib/trotsky"

describe("StepActors", () => {
  let network: TestNetwork
  let agent: AtpAgent
  let sc: SeedClient
  let bob: { "did": string; "handle": string; "password": string }
  
  beforeAll(async () => {
    network = await TestNetwork.create({ "dbPostgresSchema": "step_actors" })
    agent = network.pds.getClient()
    
    sc = network.getSeedClient()
    await usersSeed(sc)

    bob = sc.accounts[sc.dids.bob]
    await network.processAll()
    await agent.login({ "identifier": bob.handle, "password": bob.password })
  })

  afterAll(async () => {
    await network.close()
  })

  test("clone it", () => {
    const dids = Object.values(sc.dids)
    const actors = Trotsky.init(agent).actors(dids)
    const clone = actors.clone()
    expect(clone).toBeInstanceOf(StepActors)
    expect(clone).toHaveProperty("_param", dids)
  })

  test("gets n actors", async () => {
    const dids = Object.values(sc.dids)
    const actors = await Trotsky.init(agent).actors(dids).runHere()
    expect(actors.output).toHaveLength(dids.length)
  })

  test("gets n actors and iterate over StepActorsEntry without error", async () => {
    const dids = Object.values(sc.dids)
    await expect(Trotsky.init(agent).actors(dids).each().follow().run()).resolves.not.toThrow()
  })

  test("gets bob actors and iterate over StepActorsEntry without error", async () => {
    const tap = jest.fn()
    await Trotsky.init(agent).actors([bob.did]).each().tap(tap).run()
    expect(tap).toHaveBeenCalledTimes(1)
  })
})