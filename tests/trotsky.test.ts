import { beforeAll, describe, expect, test } from "@jest/globals"
import { AtpAgent } from "@atproto/api"

import { 
  Trotsky, 
  StepActor, 
  StepActorsEntry, 
  StepActorFollow, 
  StepActorFollowers, 
  StepActorFollowings,
  StepSearchPosts,
  StepPostsEntry,
  StepPostReply,
  StepWait 
} from "../lib/trotsky"

describe("Trotsky", () => {
  let agent: AtpAgent
  
  beforeAll(async () => {
    agent = new AtpAgent({ "service": "https://test.social" })    
  })

  test("gets an actor, wait 10s, gets its 10 first followers and 10 followings to follow them", async () => {
    const trotsky = Trotsky
      .init(agent)
      .actor("alice.test")
      .wait(10e3)
      .followers()
      .take(10)
      .each()        
      .follow()
      .back()
      .back()
      .followings()
      .take(10)
      .each()        
      .follow()
      .end()
              
    expect(trotsky).toBeInstanceOf(Trotsky) 
    expect(trotsky.flattenSteps).toHaveLength(8) 
    expect(trotsky.flattenSteps[0]).toBeInstanceOf(StepActor)
    expect(trotsky.flattenSteps[1]).toBeInstanceOf(StepWait)
    expect(trotsky.flattenSteps[2]).toBeInstanceOf(StepActorFollowers)
    expect(trotsky.flattenSteps[3]).toBeInstanceOf(StepActorsEntry)
    expect(trotsky.flattenSteps[4]).toBeInstanceOf(StepActorFollow)
    expect(trotsky.flattenSteps[5]).toBeInstanceOf(StepActorFollowings)
    expect(trotsky.flattenSteps[6]).toBeInstanceOf(StepActorsEntry)
    expect(trotsky.flattenSteps[7]).toBeInstanceOf(StepActorFollow)

  })

  test("searchs posts containing foo, takes the first 10 and replies \"bar\" to each and wait 1s", async () => {
    const trotsky = Trotsky
      .init(agent)
      .searchPosts({ "q": "foo" })
      .take(10)
      .each()
      .reply({ "text": "bar" })
      .wait(1e3)
      .end()
          
    expect(trotsky).toBeInstanceOf(Trotsky) 
    expect(trotsky.flattenSteps).toHaveLength(4) 
    expect(trotsky.flattenSteps[0]).toBeInstanceOf(StepSearchPosts)
    expect(trotsky.flattenSteps[1]).toBeInstanceOf(StepPostsEntry)
    expect(trotsky.flattenSteps[2]).toBeInstanceOf(StepPostReply)
    expect(trotsky.flattenSteps[3]).toBeInstanceOf(StepWait)
  })
})