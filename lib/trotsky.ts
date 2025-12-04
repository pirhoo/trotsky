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

// Abstract and top-level classes
export * from "./core/StepBuilder"
export * from "./core/Trotsky"
export * from "./core/Step"
export * from "./core/StepBuilderList"
export * from "./core/StepBuilderListEntry"
export * from "./core/StepBuilderStream"
export * from "./core/StepBuilderStreamEntry"

// Mixins
export * from "./core/mixins/ActorMixins"
export * from "./core/mixins/ListMixins"
export * from "./core/mixins/PostMixins"

// Streams
export * from "./core/StepStreamPosts"

// List of actors
export * from "./core/StepActors"
export * from "./core/StepActorsEntry"
export * from "./core/StepSearchActors"

// List of posts
export * from "./core/StepFeed"
export * from "./core/StepFeedGenerator"
export * from "./core/StepPosts"
export * from "./core/StepSuggestedFeeds"
export * from "./core/StepPostsEntry"
export * from "./core/StepSearchPosts"
export * from "./core/StepTimeline"

// List of lists
export * from "./core/StepLists"
export * from "./core/StepListsEntry"

// Single actor
export * from "./core/StepActor"
export * from "./core/StepActorBlock"
export * from "./core/StepActorBlocks"
export * from "./core/StepActorFollow"
export * from "./core/StepActorMutes"
export * from "./core/StepActorFollowers"
export * from "./core/StepActorFollowings"
export * from "./core/StepActorKnownFollowers"
export * from "./core/StepActorLikes"
export * from "./core/StepActorLists"
export * from "./core/StepActorMute"
export * from "./core/StepActorPosts"
export * from "./core/StepActorStarterPacks"
export * from "./core/StepActorSuggestions"
export * from "./core/StepActorStreamPosts"
export * from "./core/StepActorUnblock"
export * from "./core/StepActorUnfollow"
export * from "./core/StepActorUnmute"

// Single post
export * from "./core/StepCreatePost"
export * from "./core/StepDeletePost"
export * from "./core/StepPost"
export * from "./core/StepPostAuthor"
export * from "./core/StepPostLike"
export * from "./core/StepPostLikers"
export * from "./core/StepPostQuotes"
export * from "./core/StepPostReply"
export * from "./core/StepPostRepost"
export * from "./core/StepPostReposters"
export * from "./core/StepPostThread"
export * from "./core/StepPostUnlike"
export * from "./core/StepPostUnrepost"

// Single lists
export * from "./core/StepList"
export * from "./core/StepListMembers"

// Single starter pack
export * from "./core/StepStarterPack"

// List of starter packs
export * from "./core/StepStarterPacks"
export * from "./core/StepStarterPacksEntry"
export * from "./core/StepSearchStarterPacks"

// Utils
export * from "./core/StepTap"
export * from "./core/StepWait"
export * from "./core/StepWhen"
export * from "./core/StepSave"

// Main entry point class
export { Trotsky as default } from "./core/Trotsky"
