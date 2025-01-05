import { afterAll, beforeAll, describe, expect, test } from "@jest/globals"
import { AtpAgent } from "@atproto/api"
import { TestNetwork, SeedClient, followsSeed } from "@atproto/dev-env"

import { Trotsky } from "../../lib/trotsky"

describe("StepActorFollowings", () => {
  let network: TestNetwork
  let agent: AtpAgent
  let sc: SeedClient
  let alice: { "handle": string; "password": string }
  let bob: { "handle": string; "password": string }
  
  beforeAll(async () => {
    network = await TestNetwork.create({ "dbPostgresSchema": "step_actor_followings" })
    agent = network.pds.getClient()
    
    sc = network.getSeedClient()
    await followsSeed(sc)

    bob = sc.accounts[sc.dids.bob]
    alice = sc.accounts[sc.dids.alice]

    await network.processAll()
    await agent.login({ "identifier": bob.handle, "password": bob.password })
  })

  afterAll(async () => {
    await network.close()
  })

  test("get Alice's all 4 followings", async () => {
    const followings = await Trotsky.init(agent).actor(alice.handle).followings().runHere()
    expect(followings.output).toBeInstanceOf(Array)
    expect(followings.output).toHaveLength(4)
  })


  test("get Alice's 2 first followings", async () => {
    const followings = await Trotsky.init(agent).actor(alice.handle).followings().take(2).runHere()
    expect(followings.output).toBeInstanceOf(Array)
    expect(followings.output).toHaveLength(2)
  })

  test("get Alice's 2 last followings", async () => {
    const followings = await Trotsky.init(agent).actor(alice.handle).followings().skip(2).runHere()
    expect(followings.output).toBeInstanceOf(Array)
    expect(followings.output).toHaveLength(2)
  })


  test("get Alice's 2 last followings with a function", async () => {
    const followings = await Trotsky.init(agent).actor(alice.handle).followings().skip(() => 2).runHere()
    expect(followings.output).toBeInstanceOf(Array)
    expect(followings.output).toHaveLength(2)
  })

  test("get Alice's 2 last followings with a promise", async () => {
    const followings = await Trotsky.init(agent).actor(alice.handle).followings().skip(Promise.resolve(2)).runHere()
    expect(followings.output).toBeInstanceOf(Array)
    expect(followings.output).toHaveLength(2)
  })
})