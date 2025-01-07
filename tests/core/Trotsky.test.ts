import { afterAll, beforeAll, describe, expect, test } from "@jest/globals"
import { AtpAgent } from "@atproto/api"
import { TestNetwork } from "@atproto/dev-env"

import { Trotsky } from "../../lib/trotsky"

describe("Trotsky", () => {
  let network: TestNetwork
  let agent: AtpAgent
  
  beforeAll(async () => {
    network = await TestNetwork.create({ "dbPostgresSchema": "trotsky" })
    agent = network.pds.getClient()
  })

  afterAll(async () => {
    await network.close()
  })

  test("set a configuration value", () => {
    const trotsky = Trotsky.init(agent).config("foo", "bar")
    expect(trotsky.config("foo")).toBe("bar")
  })

  test("set a configuration object", () => {
    const trotsky = Trotsky.init(agent).config({ "foo": "bar" })
    expect(trotsky.config("foo")).toBe("bar")
  })

  test("override a configuration object", () => {
    const trotsky = Trotsky.init(agent).config({ "foo": "bar" }).config({ "foo": "biz" })
    expect(trotsky.config("foo")).toBe("biz")
  })
})