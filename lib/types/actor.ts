/**
 * Type definitions for actor-related operations.
 * @module types/actor
 */

import type { AppBskyActorDefs, AtUri } from "@atproto/api"

/**
 * Parameter type for identifying a single actor.
 * Can be either a DID string, handle string, or AtUri object.
 *
 * @example
 * ```ts
 * const actor1: ActorParam = "did:plc:example"
 * const actor2: ActorParam = "alice.bsky.social"
 * const actor3: ActorParam = new AtUri("at://did:plc:example/...")
 * ```
 *
 * @public
 */
export type ActorParam = string | AtUri

/**
 * Parameter type for identifying multiple actors.
 *
 * @public
 */
export type ActorsParam = ActorParam[]

/**
 * Output type for a single actor profile.
 *
 * @public
 */
export type ActorOutput = AppBskyActorDefs.ProfileViewDetailed

/**
 * Output type for multiple actor profiles.
 *
 * @public
 */
export type ActorsOutput = AppBskyActorDefs.ProfileView[]

/**
 * Output type for basic actor profile information.
 *
 * @public
 */
export type ActorProfileView = AppBskyActorDefs.ProfileView

/**
 * Output type for detailed actor profile information.
 *
 * @public
 */
export type ActorProfileViewDetailed = AppBskyActorDefs.ProfileViewDetailed
