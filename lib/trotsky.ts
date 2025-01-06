/**
 * This package provides a comprehensive suite of TypeScript classes and utilities designed 
 * to facilitate interaction with the AT Protocol (ATProto) and Bluesky's social networking 
 * services. 
 * 
 * It offers a structured approach to building and executing sequences of operations—referred 
 * to as "steps"—that interact with various aspects of the protocol, such as reading user 
 * profiles, posts, likes, follows, and more. 
 * 
 * By leveraging the schema definitions outlined in the ATProto lexicons,this package 
 * ensures type safety and consistency when interfacing with ATProto's decentralized social 
 * networking ecosystem.
 * 
 * @remarks
 * Although all classes and methods are documented and public, the package is intended for 
 * use mainly throught the {@link Trotsky} class, which serves as the main entry point using
 * a builder pattern to create and execute sequences of steps.
 * 
 * @example
 * ```ts
 * import { AtpAgent } from "@atproto/api"
 * import { Trotsky } from "trotsky"
 * 
 * async function main() {
 *  const agent = new AtpAgent({ service: "https://bsky.social" })
 *  await agent.login({ identifier: 'trotsky.pirhoo.com', password: 'p4ssw0rd' })
 * 
 *  await Trotsky.init(agent)
 *    .searchPosts({ q: "pizza" })
 *      .take(3)
 *      .each()
 *        .reply({ text: "🍕 Pizza party! 🍕" })
 *        .wait(1000)
 *        .run()
 * }
 * 
 * main()
 * ```
 * 
 * @packageDocumentation
 */

// Top-level classes
export * from "./core/StepBuilder"
export * from "./core/Trotsky"

// Abstract classes
export * from "./core/Step"
export * from "./core/StepList"
export * from "./core/StepListEntry"
export * from "./core/StepStream"
export * from "./core/StepStreamEntry"

// Mixins
export * from "./core/mixins/ActorMixins"
export * from "./core/mixins/PostMixins"

// Streams
export * from "./core/StepStreamPosts"

// List of actors
export * from "./core/StepActors"
export * from "./core/StepActorsEntry"

// List of posts
export * from "./core/StepPosts"
export * from "./core/StepPostsEntry"
export * from "./core/StepSearchPosts"

// Single actor
export * from "./core/StepActor"
export * from "./core/StepActorBlock"
export * from "./core/StepActorFollow"
export * from "./core/StepActorFollowers"
export * from "./core/StepActorFollowings"
export * from "./core/StepActorLikes"
export * from "./core/StepActorPosts"
export * from "./core/StepActorStreamPosts"
export * from "./core/StepActorUnblock"
export * from "./core/StepActorUnfollow"

// Single post
export * from "./core/StepCreatePost"
export * from "./core/StepPost"
export * from "./core/StepPostAuthor"
export * from "./core/StepPostLike"
export * from "./core/StepPostReply"
export * from "./core/StepPostRepost"

// Utils
export * from "./core/StepTap"
export * from "./core/StepWait"
export * from "./core/StepWhen"

// Main entry point class
export { Trotsky as default } from "./core/Trotsky"
