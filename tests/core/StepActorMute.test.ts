import { afterAll, beforeAll, describe, expect, test } from "@jest/globals"
import { AtpAgent } from "@atproto/api"
import { TestNetwork, SeedClient, usersSeed } from "@atproto/dev-env"

import { Trotsky } from "../../lib/trotsky"

describe("StepActorMute", () => {
  let network: TestNetwork
  let agent: AtpAgent
  let sc: SeedClient
  let alice: { "did": string; "handle": string; "password": string }
  let bob: { "did": string; "handle": string; "password": string }

  beforeAll(async () => {
    network = await TestNetwork.create({ "dbPostgresSchema": "step_actor_mute" })
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

  test("mute Alice", async () => {
    await Trotsky.init(agent).actor(alice.handle).mute().wait(1e3).run()
    const { "data": { mutes } } = await agent.app.bsky.graph.getMutes()

    expect(mutes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          "handle": alice.handle
        })
      ])
    )
  })
})
