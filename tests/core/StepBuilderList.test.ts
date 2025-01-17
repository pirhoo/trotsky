import { afterAll, beforeAll, describe, expect, jest, test } from "@jest/globals"
import { AtpAgent } from "@atproto/api"
import { TestNetwork } from "@atproto/dev-env"
import { StepBuilderList, StepBuilderListEntry, StepBuilderListIterator, Trotsky } from "../../lib/trotsky"

describe("StepBuilderList", () => {
  let network: TestNetwork
  let agent: AtpAgent
  let parent: Trotsky

  class StepTestListEntry<P> extends StepBuilderListEntry<P> {}

  class StepTestList extends StepBuilderList {
    _steps: StepTestListEntry<this>[] = [] as StepTestListEntry<this>[]

    async applyPagination (): Promise<void> { /** Empty implementation of abstract method */ }

    each (iterator?: StepBuilderListIterator) {
      return this.withIterator(iterator).append(StepTestListEntry<this>)
    }
  }
  
  beforeAll(async () => {
    network = await TestNetwork.create({ "dbPostgresSchema": "step_builder_list" })
    agent = network.pds.getClient()
    parent = Trotsky.init(agent)
  })

  afterAll(async () => {
    await network.close()
  })

  test("clone it with its property", () => {
    const list = new StepTestList(agent, parent).take(1).skip(10)
    const clone = list.clone()
    expect(clone).toBeInstanceOf(StepTestList)
    expect(clone).toHaveProperty("_take", 1)
    expect(clone).toHaveProperty("_skip", 10)
  })

  test("clone it with its iterator", () => {
    const callback = () => {}
    const list = new StepTestList(agent, parent).withIterator(callback)
    const clone = list.clone()
    expect(clone).toHaveProperty("_iterator", callback)
  })

  test("clone it with its iterator through each", () => {
    const callback = () => {}
    const list = new StepTestList(agent, parent).each(callback).back()
    const clone = list.clone()
    expect(clone).toHaveProperty("_iterator", callback)
  })

  test("call iterator once per context value", async () => {
    const callback = jest.fn() as StepBuilderListIterator
    const list = new StepTestList(agent, parent).withOutput(["foo"]).each(callback).back()
    await list.apply()
    expect(callback).toHaveBeenCalledWith(expect.any(StepTestListEntry))
    expect(callback).toHaveBeenCalledWith(expect.objectContaining({ "output": "foo" }))
  })

  test("call iterator with a cloned list", async () => {
    const callback = jest.fn() as StepBuilderListIterator
    const list = new StepTestList(agent, parent).withOutput(["foo"]).each(callback).back()
    await list.apply()
    expect(callback).toHaveBeenCalledWith(expect.any(StepTestListEntry))
    expect(callback).not.toHaveBeenCalledWith(list)
  })
})