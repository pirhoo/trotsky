import { afterAll, beforeAll, beforeEach, describe, expect, test } from "@jest/globals"
import { AtpAgent } from "@atproto/api"
import { TestNetwork } from "@atproto/dev-env"

import { Step, Trotsky } from "../../lib/trotsky"

// Step is abstract
class StepPlaceholder extends Step {
  apply (): never {
    throw new Error("Method not implemented.")
  }
}

describe("Step", () => {
  let network: TestNetwork
  let agent: AtpAgent
  let parent: Trotsky
  let step: StepPlaceholder

  
  beforeAll(async () => {
    network = await TestNetwork.create({ "dbPostgresSchema": "step" })
    agent = network.pds.getClient()
  })

  beforeEach(() => {
    parent = new Trotsky(agent)
    step = new StepPlaceholder(agent, parent)
  })

  afterAll(async () => {
    await network.close()
  })

  test("set a configuration value", () => {
    step.config("foo", "bar")
    expect(step.config("foo")).toBe("bar")
  })

  test("set a configuration object", () => {
    step.config({ "foo": "bar" })
    expect(step.config("foo")).toBe("bar")
  })

  test("override a configuration object", () => {
    step.config({ "foo": "bar" }).config({ "foo": "biz" })
    expect(step.config("foo")).toBe("biz")
  })

  test("override configuration from the parent object", () => {
    step.config({ "foo": "bar" })
    parent.config({ "foo": "biz" })
    expect(step.config("foo")).toBe("bar")
  })

  test("override configuration from the parent object regardless of the order", () => {
    parent.config({ "foo": "biz" })
    step.config({ "foo": "bar" })
    expect(step.config("foo")).toBe("bar")
  })

  test("inherit configuration from the parent object", () => {
    parent.config({ "foo": "biz" })
    expect(step.config("foo")).toBe("biz")
  })
})