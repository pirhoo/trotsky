import { afterAll, beforeAll, describe, expect, test } from "@jest/globals"
import { AtpAgent } from "@atproto/api"
import { TestNetwork, SeedClient, usersSeed } from "@atproto/dev-env"

import { Trotsky } from "../../lib/trotsky"

describe("StepActorUnmute", () => {
  let network: TestNetwork
  let agent: AtpAgent
  let sc: SeedClient
  let alice: { "did": string; "handle": string; "password": string }
  let bob: { "did": string; "handle": string; "password": string }
  let carol: { "did": string; "handle": string; "password": string }

  beforeAll(async () => {
    network = await TestNetwork.create({ "dbPostgresSchema": "step_actor_unmute" })
    agent = network.pds.getClient()

    sc = network.getSeedClient()
    await usersSeed(sc)

    bob = sc.accounts[sc.dids.bob]
    alice = sc.accounts[sc.dids.alice]
    carol = sc.accounts[sc.dids.carol]

    await network.processAll()
    await agent.login({ "identifier": bob.handle, "password": bob.password })
  })

  afterAll(async () => {
    await network.close()
  })

  test("unmute Alice", async () => {
    await Trotsky.init(agent).actor(alice.handle).mute().wait(1e3).run()
    await Trotsky.init(agent).actor(alice.handle).unmute().wait(1e3).run()

    const { "data": { mutes } } = await agent.app.bsky.graph.getMutes()

    expect(mutes).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          "handle": alice.handle
        })
      ])
    )
  })

  test("unmute Carol does nothing even if she is not muted", async () => {
    await Trotsky.init(agent).actor(carol.handle).unmute().wait(1e3).run()

    const { "data": { mutes } } = await agent.app.bsky.graph.getMutes()

    expect(mutes).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          "handle": carol.handle
        })
      ])
    )
  })
})
