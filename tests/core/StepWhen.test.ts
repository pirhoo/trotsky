import { afterAll, beforeAll, describe, expect, test } from "@jest/globals"
import { AtpAgent } from "@atproto/api"
import { TestNetwork, SeedClient, usersSeed } from "@atproto/dev-env"

import { StepWhen, Trotsky } from "../../lib/trotsky"

describe("StepWhen", () => {
  let network: TestNetwork
  let agent: AtpAgent
  let sc: SeedClient
  let alice: { "did": string; "handle": string; "password": string }
  let bob: { "did": string; "handle": string; "password": string }
  
  beforeAll(async () => {
    network = await TestNetwork.create({ "dbPostgresSchema": "step_when" })
    agent = network.pds.getClient()
    
    sc = network.getSeedClient()
    await usersSeed(sc)

    bob = sc.accounts[sc.dids.bob]
    alice = sc.accounts[sc.dids.alice]

    await network.processAll()
    await agent.login({ "identifier": bob.handle, "password": bob.password })
  })

  afterAll(async () => {
    await network.close()
  })

  test("clones it", () => {
    const clone = new StepWhen(agent, null, true).clone()
    expect(clone).toBeInstanceOf(StepWhen)
    expect(clone).toHaveProperty("_predicate", true)
  })

  test("get truthy output with a primitive true", async () => {
    const trotsky = await Trotsky.init(agent).when(true).run()
    expect(trotsky.steps[0].output).toBeTruthy()
  })

  test("get truthy output with a function returning true", async () => {
    const trotsky = await Trotsky.init(agent).when(() => true).run()
    expect(trotsky.steps[0].output).toBeTruthy()
  })

  test("get truthy output with a promise returning true", async () => {
    const trotsky = await Trotsky.init(agent).when(async () => true).run()
    expect(trotsky.steps[0].output).toBeTruthy()
  })

  test("get truthy output with a resolved promise returning true", async () => {
    const trotsky = await Trotsky.init(agent).when(Promise.resolve(true)).run()
    expect(trotsky.steps[0].output).toBeTruthy()
  })
  
  test("get falsy output with a primitive false", async () => {
    const trotsky = await Trotsky.init(agent).when(false).run()
    expect(trotsky.steps[0].output).toBeFalsy()
  })

  test("get falsy output with a function returning false", async () => {
    const trotsky = await Trotsky.init(agent).when(() => false).run()
    expect(trotsky.steps[0].output).toBeFalsy()
  })

  test("get falsy output with a promise returning false", async () => {
    const trotsky = await Trotsky.init(agent).when(async () => false).run()
    expect(trotsky.steps[0].output).toBeFalsy()
  })

  test("get falsy output with a resolved promise returning false", async () => {
    const trotsky = await Trotsky.init(agent).when(Promise.resolve(false)).run()
    expect(trotsky.steps[0].output).toBeFalsy()
  })

  test("follow alice when condition is truthy", async () => {
    /* eslint-disable @stylistic/ts/indent */
    await Trotsky.init(agent)
      .actor(alice.handle)
      .when(() => true)
        .follow()
        .wait(1e3)
        .run()
    /* eslint-enable @stylistic/ts/indent */

    const actor = bob.did
    const others = [alice.did]
    const { "data": { relationships } } = await agent.app.bsky.graph.getRelationships({ actor, others })

    expect(relationships).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ 
          "following": expect.stringContaining(`at://${agent.did}/`)
        })
      ])
    )
  })

  test("dont follow bob when condition is truthy", async () => {
    /* eslint-disable @stylistic/ts/indent */
    await Trotsky.init(agent)
      .actor(bob.handle)
      .when(() => false)
        .follow()
        .wait(1e3)
        .run()
    /* eslint-enable @stylistic/ts/indent */

    const actor = alice.did
    const others = [bob.did]
    const { "data": { relationships } } = await agent.app.bsky.graph.getRelationships({ actor, others })

    expect(relationships).toEqual(
      expect.arrayContaining([
        expect.not.objectContaining({ 
          "did": bob.did,
          "following": expect.any(String)
        })
      ])
    )
  })
})