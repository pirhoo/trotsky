import fs from "fs/promises"
import path from "path"
import { afterAll, beforeAll, beforeEach, describe, expect, test } from "@jest/globals"
import { AtpAgent } from "@atproto/api"
import { TestNetwork, SeedClient, usersSeed } from "@atproto/dev-env"

import { StepSave, Trotsky } from "../../lib/trotsky"

describe("StepSave", () => {
  let network: TestNetwork
  let agent: AtpAgent
  let sc: SeedClient
  let bob: { "did": string; "handle": string; "password": string }
  let output: string
  
  beforeAll(async () => {
    network = await TestNetwork.create({ "dbPostgresSchema": "step_save" })
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
  
  beforeEach(async () => {
    output = path.join(await fs.mkdtemp("/tmp/trotsky-"), "output.json")
  })

  test("clone it", () => {
    const dids = Object.values(sc.dids)
    const trotsky = Trotsky.init(agent).actors(dids).save(output)
    const clone = trotsky.steps[trotsky.steps.length - 1].clone()
    expect(clone).toBeInstanceOf(StepSave)
    expect(clone).toHaveProperty("_path", output)
  })

  test("clone it without path", () => {
    const dids = Object.values(sc.dids)
    const trotsky = Trotsky.init(agent).actors(dids).save()
    const clone = trotsky.steps[trotsky.steps.length - 1].clone()
    expect(clone).toBeInstanceOf(StepSave)
    expect(clone).toHaveProperty("_path", null)
  })

  test("save a list of actors", async () => {
    const dids = Object.values(sc.dids)
    await Trotsky.init(agent).actors(dids).save(output).run()
    const json = JSON.parse(await fs.readFile(output, "utf-8"))
    expect(json).toHaveLength(dids.length)
    expect(json).toContainEqual(expect.objectContaining({ "did": dids[0] }))
    expect(json).toContainEqual(expect.objectContaining({ "did": dids[1] }))
  })

  test("save a given actor", async () => {
    await Trotsky.init(agent).actor(bob.did).save(output).run()
    const json = JSON.parse(await fs.readFile(output, "utf-8"))
    expect(json).toHaveProperty("did", bob.did)
    expect(json).toHaveProperty("handle", bob.handle)
  })
})