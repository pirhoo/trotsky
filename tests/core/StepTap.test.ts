import { afterAll, beforeAll, describe, expect, jest, test } from "@jest/globals"
import { AtpAgent } from "@atproto/api"
import { TestNetwork, SeedClient, followsSeed } from "@atproto/dev-env"

import { Trotsky } from "../../lib/trotsky"

describe("Step", () => {
  let network: TestNetwork
  let agent: AtpAgent
  let sc: SeedClient
  let bob: { "did": string; "handle": string; "password": string }
  
  beforeAll(async () => {
    network = await TestNetwork.create({ "dbPostgresSchema": "step_tap" })
    agent = network.pds.getClient()
    
    sc = network.getSeedClient()
    await followsSeed(sc)

    bob = sc.accounts[sc.dids.bob]

    await network.processAll()
    await agent.login({ "identifier": bob.handle, "password": bob.password })
  })

  afterAll(async () => {
    await network.close()
  })

  test("call tap for each of Bob's followers", async () => {
    const tap = jest.fn()
    /* eslint-disable @stylistic/ts/indent */
    await Trotsky
      .init(agent)
      .actor(bob.handle)
        .followers()
        .each()
          .tap(tap)
          .run()
    /* eslint-enable @stylistic/ts/indent */
    expect(tap).toHaveBeenCalledTimes(2)
  })

  test("call tap once without context", async () => {
    const tap = jest.fn()
     
    await Trotsky.init(agent).actor(bob.handle).tap(tap).run()
     
    expect(tap).toHaveBeenCalledTimes(1)
    expect(tap).toHaveBeenCalledWith(expect.objectContaining({ "output": null }))
  })
})