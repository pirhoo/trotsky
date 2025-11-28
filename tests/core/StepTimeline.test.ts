import { afterAll, beforeAll, describe, expect, test } from "@jest/globals"
import { TestNetwork, SeedClient, usersSeed } from "@atproto/dev-env"
import { AtpAgent } from "@atproto/api"
import { Trotsky, StepTimeline } from "../../lib/trotsky"

describe("StepTimeline", () => {
  let network: TestNetwork
  let agent: AtpAgent
  let sc: SeedClient

  // accounts
  let bob: { "did": string; "handle": string; "password": string }
  let alice: { "did": string; "handle": string; "password": string }
  let carol: { "did": string; "handle": string; "password": string }

  beforeAll(async () => {
    network = await TestNetwork.create({
      "dbPostgresSchema": "trotsky_step_timeline"
    })

    agent = network.pds.getClient()
    sc = network.getSeedClient()

    // Seed users
    await usersSeed(sc)
    bob = sc.accounts[sc.dids.bob]
    alice = sc.accounts[sc.dids.alice]
    carol = sc.accounts[sc.dids.carol]

    // Login as bob
    await agent.login({ "identifier": bob.handle, "password": bob.password })

    // Bob follows Alice and Carol
    await agent.app.bsky.graph.follow.create(
      { "repo": bob.did },
      { "subject": alice.did, "createdAt": new Date().toISOString() }
    )
    await agent.app.bsky.graph.follow.create(
      { "repo": bob.did },
      { "subject": carol.did, "createdAt": new Date().toISOString() }
    )

    // Alice and Carol create posts
    await sc.post(alice.did, "Alice's first post about TypeScript")
    await sc.post(alice.did, "Alice's second post about JavaScript")
    await sc.post(carol.did, "Carol's post about Python")
    await sc.post(carol.did, "Carol's post about Rust")

    await network.processAll()
  }, 120e3)

  afterAll(async () => {
    await network.close()
  })

  test("should clone properly", () => {
    const step = Trotsky.init(agent).timeline()
    const cloned = step.clone()
    expect(cloned).toBeInstanceOf(StepTimeline)
  })

  test("should get timeline posts", async () => {
    const timeline = await Trotsky.init(agent)
      .timeline()
      .runHere()

    expect(timeline).toBeInstanceOf(StepTimeline)
    expect(timeline.output).toBeInstanceOf(Array)
    // Bob should see posts from Alice and Carol (at least 4 posts)
    expect(timeline.output.length).toBeGreaterThanOrEqual(4)
  })

  test("should return posts with correct structure", async () => {
    const timeline = await Trotsky.init(agent)
      .timeline()
      .runHere()

    timeline.output.forEach(post => {
      expect(post).toHaveProperty("uri")
      expect(post).toHaveProperty("cid")
      expect(post).toHaveProperty("author")
      expect(post).toHaveProperty("record")
      expect(post.author).toHaveProperty("handle")
      expect(post.author).toHaveProperty("did")
    })
  })

  test("should verify timeline contains posts from followed users", async () => {
    const timeline = await Trotsky.init(agent)
      .timeline()
      .runHere()

    const authorDids = timeline.output.map(post => post.author.did)

    // Timeline should contain posts from Alice or Carol
    const hasAliceOrCarol = authorDids.some(did =>
      did === alice.did || did === carol.did
    )
    expect(hasAliceOrCarol).toBe(true)
  })

  test("should iterate through each timeline post", async () => {
    const postUris: string[] = []

    await Trotsky.init(agent)
      .timeline()
      .take(3)
      .each()
      .tap((step) => {
        if (step?.context?.uri) {
          postUris.push(step.context.uri)
        }
      })
      .run()

    expect(postUris.length).toBeGreaterThan(0)
    expect(postUris.length).toBeLessThanOrEqual(3)
  })

  test("should filter timeline posts with when()", async () => {
    const filteredPosts: string[] = []

    await Trotsky.init(agent)
      .timeline()
      .take(10)
      .each()
      .when((step) => step?.context?.author?.did === alice.did)
      .tap((step) => {
        if (step?.context?.uri) {
          filteredPosts.push(step.context.uri)
        }
      })
      .run()

    // All filtered posts should be from Alice
    const timeline = await Trotsky.init(agent).timeline().runHere()
    const alicePosts = timeline.output.filter(p => p.author.did === alice.did)

    expect(filteredPosts.length).toBeLessThanOrEqual(alicePosts.length)
  })

  test("should handle pagination with take()", async () => {
    const timeline = await Trotsky.init(agent)
      .timeline()
      .take(2)
      .runHere()

    expect(timeline.output.length).toBeLessThanOrEqual(2)
  })

  test("should work with custom query parameters", async () => {
    const timeline = await Trotsky.init(agent)
      .timeline({ "limit": 5 })
      .runHere()

    expect(timeline.output).toBeInstanceOf(Array)
    expect(timeline.output.length).toBeLessThanOrEqual(5)
  })

  test("should return indexed timestamps", async () => {
    const timeline = await Trotsky.init(agent)
      .timeline()
      .take(5)
      .runHere()

    timeline.output.forEach(post => {
      expect(post).toHaveProperty("indexedAt")
      expect(post.indexedAt).toBeTruthy()
    })
  })

  test("should work with tap() to process results", async () => {
    let processedCount = 0

    await Trotsky.init(agent)
      .timeline()
      .take(3)
      .each()
      .tap(() => {
        processedCount++
      })
      .run()

    expect(processedCount).toBeGreaterThan(0)
    expect(processedCount).toBeLessThanOrEqual(3)
  })

  test("should handle empty timeline for new user", async () => {
    // Create a new user who doesn't follow anyone
    await sc.createAccount("newuser", {
      "handle": "newuser.test",
      "email": "newuser@test.com",
      "password": "password"
    })

    const newAgent = network.pds.getClient()
    await newAgent.login({ "identifier": "newuser.test", "password": "password" })

    await network.processAll()

    const timeline = await Trotsky.init(newAgent)
      .timeline()
      .runHere()

    expect(timeline.output).toBeInstanceOf(Array)
    // New user should have empty or minimal timeline
    expect(timeline.output.length).toBeLessThanOrEqual(10)
  })

  test("should support algorithm parameter", async () => {
    const timeline = await Trotsky.init(agent)
      .timeline({ "algorithm": "reverse-chronological" })
      .take(5)
      .runHere()

    expect(timeline.output).toBeInstanceOf(Array)
  })
})
