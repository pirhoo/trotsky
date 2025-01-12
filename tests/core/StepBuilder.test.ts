import { afterAll, beforeAll, describe, expect, test, jest } from "@jest/globals"
import { AtpAgent } from "@atproto/api"
import { TestNetwork } from "@atproto/dev-env"
import { StepBuilder, StepTap } from "../../lib/trotsky"

describe("StepBuilder", () => {
  let network: TestNetwork
  let agent: AtpAgent

  class StepTest extends StepBuilder {
    async apply (): Promise<void> {}
  }
  
  beforeAll(async () => {
    network = await TestNetwork.create({ "dbPostgresSchema": "step_builder" })
    agent = network.pds.getClient()
  })

  afterAll(async () => {
    await network.close()
  })

  test("clone it", () => {
    const list = new StepTest(agent)
    const clone = list.clone()
    expect(clone).toBeInstanceOf(StepTest)
    expect(clone).not.toBe(list)
  })

  test("clone it with the same agent", () => {
    const list = new StepTest(agent)
    const clone = list.clone()
    expect(clone.agent).toBe(agent)
  })

  test("clone it with the same config", () => {
    const list = new StepTest(agent).config("foo", "bar")
    const clone = list.clone()
    expect(clone.config("foo")).toEqual("bar")
  })

  test("clone with its steps", () => {
    const list = new StepTest(agent)
    const tap = new StepTap(agent, list, jest.fn())
    list.push(tap)
    const clone = list.clone()
    expect(clone.steps).toHaveLength(1)
    expect(clone.steps[0]).toBeInstanceOf(StepTap)
  })

  test("clear steps", () => {
    const list = new StepTest(agent)
    const tap = new StepTap(agent, list, jest.fn())
    list.push(tap)
    expect(list.steps).toHaveLength(1)
    list.clear()
    expect(list.steps).toHaveLength(0)
  })

  test("push one step", () => {
    const list = new StepTest(agent)
    list.push(new StepTap(agent, list, jest.fn()))
    expect(list.steps).toHaveLength(1)
  })

  test("push two steps at the same time", () => {
    const list = new StepTest(agent)
    list.push(new StepTap(agent, list, jest.fn()), new StepTap(agent, list, jest.fn()))
    expect(list.steps).toHaveLength(2)
  })

  test("slice step first step with index", () => {
    const list = new StepTest(agent)
    const tap_a = new StepTap(agent, list, jest.fn())
    const tap_b = new StepTap(agent, list, jest.fn())
    list.push(tap_a, tap_b)
    list.slice(0)
    expect(list.steps).toHaveLength(1)
    expect(list.steps[0]).toBe(tap_b)
  })

  test("slice step first step with object", () => {
    const list = new StepTest(agent)
    const tap_a = new StepTap(agent, list, jest.fn())
    const tap_b = new StepTap(agent, list, jest.fn())
    list.push(tap_a, tap_b)
    list.slice(tap_a)
    expect(list.steps).toHaveLength(1)
    expect(list.steps[0]).toBe(tap_b)
  })

  test("slice step second step with index", () => {
    const list = new StepTest(agent)
    const tap_a = new StepTap(agent, list, jest.fn())
    const tap_b = new StepTap(agent, list, jest.fn())
    list.push(tap_a, tap_b)
    list.slice(1)
    expect(list.steps).toHaveLength(1)
    expect(list.steps[0]).toBe(tap_a)
  })

  test("slice step second step with object", () => {
    const list = new StepTest(agent)
    const tap_a = new StepTap(agent, list, jest.fn())
    const tap_b = new StepTap(agent, list, jest.fn())
    list.push(tap_a, tap_b)
    list.slice(tap_b)
    expect(list.steps).toHaveLength(1)
    expect(list.steps[0]).toBe(tap_a)
  })
})