import { afterAll, beforeAll, describe, expect, test } from "@jest/globals"
import { AtpAgent } from "@atproto/api"
import { TestNetwork, SeedClient, usersSeed } from "@atproto/dev-env"

import { StepActor, Trotsky } from "../../lib/trotsky"

describe("StepActor", () => {
  let network: TestNetwork
  let agent: AtpAgent
  let sc: SeedClient
  let alice: { "did": string; "handle": string; "password": string }
  let bob: { "did": string; "handle": string; "password": string }
  
  beforeAll(async () => {
    network = await TestNetwork.create({ "dbPostgresSchema": "step_actor" })
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
    const clone = new StepActor(agent, null, "pirhoo.com").clone()
    expect(clone).toBeInstanceOf(StepActor)
    expect(clone).toHaveProperty("_param", "pirhoo.com")
  })

  test("get Alice's profile", async () => {
    const trotsky = await Trotsky.init(agent)
    const actor = trotsky.actor(alice.handle)
    expect(await trotsky.run()).toBeInstanceOf(Trotsky)
    expect(actor.output).toHaveProperty("handle", alice.handle)
  })

  test("get Alice's profile with a promise", async () => {
    const trotsky = await Trotsky.init(agent)
    const actor = trotsky.actor(async () => alice.handle)
    expect(await trotsky.run()).toBeInstanceOf(Trotsky)
    expect(actor.output).toHaveProperty("handle", alice.handle)
  })
  
  test("get Alice's followers", async () => {
    const trotsky = Trotsky.init(agent).actor(alice.handle).followers()
    expect(await trotsky.run()).toBeInstanceOf(Trotsky)
  })
  
  test("get Alice's followings", async () => {
    const trotsky = Trotsky.init(agent).actor(alice.handle).followings()
    expect(await trotsky.run()).toBeInstanceOf(Trotsky)
  })
})