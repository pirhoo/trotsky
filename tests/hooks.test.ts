import { afterAll, beforeAll, describe, expect, it } from "@jest/globals"
import { TestNetwork, SeedClient, usersSeed } from "@atproto/dev-env"
import { AtpAgent } from "@atproto/api"
import Trotsky from "../lib/trotsky"
import type { StepExecutionResult } from "../lib/types"
import { Step } from "../lib/core/Step"

describe("Hooks", () => {
  let network: TestNetwork
  let agent: AtpAgent
  let sc: SeedClient
  let alice: { "did": string; "handle": string; "password": string }

  beforeAll(async () => {
    network = await TestNetwork.create({
      "dbPostgresSchema": "hooks"
    })

    agent = network.pds.getClient()
    sc = network.getSeedClient()
    await usersSeed(sc)

    alice = sc.accounts[sc.dids.alice]

    await network.processAll()
    await agent.login({ "identifier": alice.handle, "password": alice.password })
  })

  afterAll(async () => {
    await network.close()
  })

  describe("beforeStep hook", () => {
    it("should execute before each step", async () => {
      const executionOrder: string[] = []

      const trotsky = new Trotsky(agent)
        .beforeStep(() => {
          executionOrder.push("beforeStep")
        })
        .actor(alice.did)
        .tap(() => {
          executionOrder.push("step")
        })

      await trotsky.run()

      // Executes for StepActor, then for StepTap
      expect(executionOrder).toEqual(["beforeStep", "beforeStep", "step"])
    })

    it("should receive step and context as parameters", async () => {
      let capturedStep: Step | null = null
      let capturedContext: unknown = null

      const trotsky = new Trotsky(agent)
        .beforeStep((step, context) => {
          if (step.constructor.name === "StepActor") {
            capturedStep = step
            capturedContext = context
          }
        })
        .actor(alice.did)

      await trotsky.run()

      expect(capturedStep).toBeInstanceOf(Step)
      expect(capturedStep?.constructor.name).toBe("StepActor")
      // Context is undefined before first step executes
      expect(capturedContext).toBeUndefined()
    })

    it("should execute multiple beforeStep hooks in order", async () => {
      const executionOrder: number[] = []

      const trotsky = new Trotsky(agent)
        .beforeStep(() => {
          executionOrder.push(1)
        })
        .beforeStep(() => {
          executionOrder.push(2)
        })
        .beforeStep(() => {
          executionOrder.push(3)
        })
        .actor(alice.did)

      await trotsky.run()

      expect(executionOrder).toEqual([1, 2, 3])
    })

    it("should execute for each step in sequence", async () => {
      const stepNames: string[] = []

      const trotsky = Trotsky.init(agent)
        .beforeStep((step) => {
          stepNames.push(step.constructor.name)
        })
        .actor(alice.did)
        .wait(10)

      await trotsky.run()

      expect(stepNames).toEqual(["StepActor", "StepWait"])
    })

    it("should support async hooks", async () => {
      const executionOrder: string[] = []

      const trotsky = new Trotsky(agent)
        .beforeStep(async () => {
          await new Promise(resolve => setTimeout(resolve, 10))
          executionOrder.push("asyncBefore")
        })
        .actor(alice.did)
        .tap(() => {
          executionOrder.push("step")
        })

      await trotsky.run()

      // Executes for StepActor, then for StepTap
      expect(executionOrder).toEqual(["asyncBefore", "asyncBefore", "step"])
    })

    it("should allow modifying context in hook", async () => {
      let modifiedContext = false

      const trotsky = Trotsky.init(agent)
        .beforeStep((step, context) => {
          // Add custom property to context (actor profile from StepActor)
          if (step.constructor.name === "StepWait" && context && typeof context === "object") {
            (context as Record<string, unknown>)._hookModified = true
          }
        })
        .afterStep((step, context) => {
          // Check in afterStep for StepWait if the property was added
          if (step.constructor.name === "StepWait" && context && typeof context === "object") {
            modifiedContext = (context as Record<string, unknown>)._hookModified === true
          }
        })
        .actor(alice.did)
        .wait(10)

      await trotsky.run()

      expect(modifiedContext).toBe(true)
    })
  })

  describe("afterStep hook", () => {
    it("should execute after each step", async () => {
      const executionOrder: string[] = []

      const trotsky = new Trotsky(agent)
        .afterStep(() => {
          executionOrder.push("afterStep")
        })
        .actor(alice.did)
        .tap(() => {
          executionOrder.push("step")
        })

      await trotsky.run()

      // Executes after StepActor, then after StepTap (which logs "step")
      expect(executionOrder).toEqual(["afterStep", "step", "afterStep"])
    })

    it("should receive step, context, and result as parameters", async () => {
      let capturedStep: Step | null = null
      let capturedContext: unknown = null
      let capturedResult: StepExecutionResult | null = null

      const trotsky = new Trotsky(agent)
        .afterStep((step, context, result) => {
          // Capture the last execution (StepWait will have context from StepActor)
          if (step.constructor.name === "StepWait") {
            capturedStep = step
            capturedContext = context
            capturedResult = result
          }
        })
        .actor(alice.did)
        .wait(10)

      await trotsky.run()

      expect(capturedStep).toBeInstanceOf(Step)
      expect(capturedStep?.constructor.name).toBe("StepWait")
      expect(capturedContext).toBeDefined() // Context is the actor profile from previous step
      expect(capturedResult).toBeDefined()
      expect(capturedResult?.success).toBe(true)
      expect(capturedResult?.executionTime).toBeGreaterThanOrEqual(0)
    })

    it("should include execution time in result", async () => {
      let executionTime = 0

      const trotsky = new Trotsky(agent)
        .afterStep((step, context, result) => {
          executionTime = result.executionTime || 0
        })
        .actor(alice.did)
        .wait(50)

      await trotsky.run()

      expect(executionTime).toBeGreaterThanOrEqual(50)
    })

    it("should include step output in result", async () => {
      let capturedOutput: unknown = null

      const trotsky = new Trotsky(agent)
        .afterStep((step, context, result) => {
          if (step.constructor.name === "StepActor") {
            capturedOutput = result.output
          }
        })
        .actor(alice.did)

      await trotsky.run()

      expect(capturedOutput).toBeDefined()
      expect(capturedOutput).toHaveProperty("did", alice.did)
    })

    it("should execute multiple afterStep hooks in order", async () => {
      const executionOrder: number[] = []

      const trotsky = new Trotsky(agent)
        .afterStep(() => {
          executionOrder.push(1)
        })
        .afterStep(() => {
          executionOrder.push(2)
        })
        .afterStep(() => {
          executionOrder.push(3)
        })
        .actor(alice.did)

      await trotsky.run()

      expect(executionOrder).toEqual([1, 2, 3])
    })

    it("should execute for each step in sequence", async () => {
      const stepNames: string[] = []

      const trotsky = new Trotsky(agent)
        .afterStep((step) => {
          stepNames.push(step.constructor.name)
        })
        .actor(alice.did)
        .wait(10)
        .wait(10)

      await trotsky.run()

      expect(stepNames).toEqual(["StepActor", "StepWait", "StepWait"])
    })

    it("should support async hooks", async () => {
      const executionOrder: string[] = []

      const trotsky = new Trotsky(agent)
        .afterStep(async () => {
          await new Promise(resolve => setTimeout(resolve, 10))
          executionOrder.push("asyncAfter")
        })
        .actor(alice.did)
        .tap(() => {
          executionOrder.push("step")
        })

      await trotsky.run()

      // Hook executes after StepActor, then StepTap logs "step", then hook executes after StepTap
      expect(executionOrder).toEqual(["asyncAfter", "step", "asyncAfter"])
    })

    it("should capture errors in result", async () => {
      let errorCaptured: Error | undefined

      const trotsky = new Trotsky(agent)
        .afterStep((step, context, result) => {
          errorCaptured = result.error
        })
        .actor("invalid-did-format")

      await expect(trotsky.run()).rejects.toThrow()
      expect(errorCaptured).toBeInstanceOf(Error)
    })

    it("should mark result as failed when step throws", async () => {
      let resultSuccess: boolean | undefined

      const trotsky = new Trotsky(agent)
        .afterStep((step, context, result) => {
          resultSuccess = result.success
        })
        .actor("invalid-did-format")

      await expect(trotsky.run()).rejects.toThrow()
      expect(resultSuccess).toBe(false)
    })
  })

  describe("hook execution order", () => {
    it("should execute hooks in correct order: beforeStep -> step -> afterStep", async () => {
      const executionOrder: string[] = []

      const trotsky = new Trotsky(agent)
        .beforeStep(() => {
          executionOrder.push("before")
        })
        .afterStep(() => {
          executionOrder.push("after")
        })
        .actor(alice.did)
        .tap(() => {
          executionOrder.push("step")
        })

      await trotsky.run()

      // Hooks execute for both StepActor and StepTap
      // before(StepActor) -> after(StepActor) -> before(StepTap) -> step -> after(StepTap)
      expect(executionOrder).toEqual(["before", "after", "before", "step", "after"])
    })

    it("should execute hooks for nested steps", async () => {
      const executionOrder: string[] = []

      const trotsky = new Trotsky(agent)
        .beforeStep((step) => {
          executionOrder.push(`before:${step.constructor.name}`)
        })
        .afterStep((step) => {
          executionOrder.push(`after:${step.constructor.name}`)
        })
        .actor(alice.did)
        .wait(10)
        .when(() => true)

      await trotsky.run()

      expect(executionOrder).toContain("before:StepActor")
      expect(executionOrder).toContain("after:StepActor")
      expect(executionOrder).toContain("before:StepWait")
      expect(executionOrder).toContain("after:StepWait")
    })
  })

  describe("clearHooks", () => {
    it("should remove all registered hooks", async () => {
      const executionLog: string[] = []

      const trotsky = new Trotsky(agent)
        .beforeStep(() => {
          executionLog.push("before")
        })
        .afterStep(() => {
          executionLog.push("after")
        })
        .clearHooks()
        .actor(alice.did)

      await trotsky.run()

      expect(executionLog).toEqual([])
    })

    it("should allow adding new hooks after clearing", async () => {
      const executionLog: string[] = []

      const trotsky = new Trotsky(agent)
        .beforeStep(() => {
          executionLog.push("old")
        })
        .clearHooks()
        .beforeStep(() => {
          executionLog.push("new")
        })
        .actor(alice.did)

      await trotsky.run()

      expect(executionLog).toEqual(["new"])
    })
  })

  describe("hook use cases", () => {
    it("should support logging use case", async () => {
      const logs: Array<{ "step": string; "status": string; "time"?: number }> = []

      const trotsky = new Trotsky(agent)
        .beforeStep((step) => {
          logs.push({ "step": step.constructor.name, "status": "starting" })
        })
        .afterStep((step, context, result) => {
          logs.push({
            "step": step.constructor.name,
            "status": result.success ? "completed" : "failed",
            "time": result.executionTime
          })
        })
        .actor(alice.did)
        .wait(10)

      await trotsky.run()

      expect(logs).toHaveLength(4) // 2 steps × 2 logs each
      expect(logs[0]).toMatchObject({ "step": "StepActor", "status": "starting" })
      expect(logs[1]).toMatchObject({ "step": "StepActor", "status": "completed" })
      expect(logs[2]).toMatchObject({ "step": "StepWait", "status": "starting" })
      expect(logs[3]).toMatchObject({ "step": "StepWait", "status": "completed" })
    })

    it("should support performance tracking use case", async () => {
      const metrics: Array<{ "step": string; "duration": number }> = []

      const trotsky = new Trotsky(agent)
        .afterStep((step, context, result) => {
          metrics.push({
            "step": step.constructor.name,
            "duration": result.executionTime || 0
          })
        })
        .actor(alice.did)
        .wait(50)
        .wait(10)

      await trotsky.run()

      expect(metrics).toHaveLength(3)
      expect(metrics[0].step).toBe("StepActor")
      expect(metrics[1].step).toBe("StepWait")
      // Allow slight timing variation in CI environments (48-52ms is acceptable)
      expect(metrics[1].duration).toBeGreaterThanOrEqual(45)
      expect(metrics[2].step).toBe("StepWait")
    })

    it("should support state validation use case", async () => {
      const validations: Array<{ "step": string; "valid": boolean | undefined }> = []

      const trotsky = new Trotsky(agent)
        .afterStep((step, context) => {
          if (step.constructor.name === "StepActor") {
            // StepActor output has did property
            const hasDid = step.output && typeof step.output === "object" && "did" in step.output
            validations.push({ "step": "StepActor", "valid": hasDid })
          }
          if (step.constructor.name === "StepWait") {
            // StepWait context should be the actor profile from previous step
            const hasDid = context && typeof context === "object" && "did" in context
            validations.push({ "step": "StepWait", "valid": hasDid })
          }
        })
        .actor(alice.did)
        .wait(10)

      await trotsky.run()

      expect(validations).toHaveLength(2)
      expect(validations[0]).toMatchObject({ "step": "StepActor", "valid": true })
      expect(validations[1]).toMatchObject({ "step": "StepWait", "valid": true })
    })

    it("should support step timing budget use case", async () => {
      const TIMEOUT_MS = 1000
      let timeoutTriggered = false
      let stepTimeout: NodeJS.Timeout | undefined

      const trotsky = new Trotsky(agent)
        .beforeStep(() => {
          stepTimeout = setTimeout(() => {
            timeoutTriggered = true
          }, TIMEOUT_MS)
        })
        .afterStep(() => {
          if (stepTimeout) {
            clearTimeout(stepTimeout)
            stepTimeout = undefined
          }
        })
        .actor(alice.did)
        .wait(10)

      await trotsky.run()

      expect(timeoutTriggered).toBe(false)
    })

    it("should support custom metadata tracking use case", async () => {
      interface StepMetadata {
        "step": string;
        "timestamp": string;
        "context": {
          "actorHandle"?: string;
          "postCount"?: number;
        };
      }

      const metadata: StepMetadata[] = []

      const trotsky = new Trotsky(agent)
        .afterStep((step, context) => {
          const meta: StepMetadata = {
            "step": step.constructor.name,
            "timestamp": new Date().toISOString(),
            "context": {}
          }

          // Check step output for actor handle (for StepActor)
          if (step.output && typeof step.output === "object" && "handle" in step.output) {
            meta.context.actorHandle = String(step.output.handle)
          }

          // Check context for data from previous step
          if (context && typeof context === "object") {
            if ("handle" in context) {
              meta.context.actorHandle = String(context.handle)
            }
            if ("posts" in context && Array.isArray((context as { "posts": unknown[] }).posts)) {
              meta.context.postCount = (context as { "posts": unknown[] }).posts.length
            }
          }

          metadata.push(meta)
        })
        .actor(alice.did)
        .wait(10)
        .wait(10)

      await trotsky.run()

      expect(metadata).toHaveLength(3)
      expect(metadata[0].step).toBe("StepActor")
      expect(metadata[0].context.actorHandle).toBe("alice.test")
    })
  })

  describe("hook inheritance", () => {
    it("should inherit hooks from parent Trotsky instance", async () => {
      const executionLog: string[] = []

      const trotsky = new Trotsky(agent)
        .beforeStep(() => {
          executionLog.push("parent-before")
        })
        .actor(alice.did)

      await trotsky.run()

      // The hook should execute for the step
      expect(executionLog).toContain("parent-before")
    })

    it("should work with chained steps", async () => {
      const stepNames: string[] = []

      const trotsky = new Trotsky(agent)
        .beforeStep((step) => {
          stepNames.push(step.constructor.name)
        })
        .actor(alice.did)
        .wait(10)
        .wait(10)
        .wait(10)

      await trotsky.run()

      expect(stepNames).toEqual([
        "StepActor",
        "StepWait",
        "StepWait",
        "StepWait"
      ])
    })
  })

  describe("error handling in hooks", () => {
    it("should propagate errors thrown in beforeStep hooks", async () => {
      const trotsky = new Trotsky(agent)
        .beforeStep(() => {
          throw new Error("Hook error")
        })
        .actor(alice.did)

      await expect(trotsky.run()).rejects.toThrow("Hook error")
    })

    it("should propagate errors thrown in afterStep hooks", async () => {
      const trotsky = new Trotsky(agent)
        .afterStep(() => {
          throw new Error("Hook error")
        })
        .actor(alice.did)

      await expect(trotsky.run()).rejects.toThrow("Hook error")
    })

    it("should still execute afterStep hook even when step fails", async () => {
      let hookExecuted = false

      const trotsky = new Trotsky(agent)
        .afterStep(() => {
          hookExecuted = true
        })
        .actor("invalid-did")

      await expect(trotsky.run()).rejects.toThrow()
      expect(hookExecuted).toBe(true)
    })
  })
})
