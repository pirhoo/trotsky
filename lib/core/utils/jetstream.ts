import type { Did, FollowRecord, LikeRecord, PostRecord } from "@atproto/api"
import WebSocket from "ws"
import EventEmitter from "events"

import { decompressJetstreamZstd } from "./zstd"

/**
 * Base structure for a Jetstream message.
 */
export interface JetstreamMessageBase {
  "did": Did;
  "time_us": number;
  "kind": "commit" | "identity" | "account";
}

/**
 * Represents a commit-type Jetstream message.
 */
export interface JetstreamMessageCommit extends JetstreamMessageBase {
  "commit": {
    "rev": string;
    "operation": "create" | "update" | "delete";
    "collection": string;
    "rkey": string;
    "cid": string;
    "record"?: Partial<PostRecord> | Partial<LikeRecord> | Partial<FollowRecord>;
  };
}

/**
 * Represents an identity-type Jetstream message.
 */
export interface JetstreamMessageIdentity extends JetstreamMessageBase {
  "identity": {
    "did": Did;
    "handle": string;
    "seq": number;
    "time": string;
  };
}

/**
 * Represents an account-type Jetstream message.
 */
export interface JetstreamMessageAccount extends JetstreamMessageBase {
  "account": {
    "active": boolean;
    "did": Did;
    "seq": number;
    "time": string;
  };
}

/**
 * Union type representing all possible Jetstream message types.
 */
export type JetstreamMessage = JetstreamMessageCommit | JetstreamMessageIdentity | JetstreamMessageAccount

/**
 * Defines the types of events emitted by the Jetstream event emitter.
 */
export type JetstreamEventTypes = {
  "error": [error: Error];
  "message": [message: JetstreamMessage];
}

/**
 * Represents a Jetstream event emitter with strongly typed events.
 */
export type JetstreamEventEmitter = EventEmitter<JetstreamEventTypes>

/**
 * The base URL for the Jetstream service.
 */
const JETSTREAM_URL = "wss://jetstream1.us-east.bsky.network/subscribe?compress=true"

/**
 * Constructs a Jetstream subscription URL with query parameters for filtering collections, DIDs, or message size.
 * 
 * @param wantedCollections - The collections to subscribe to.
 * @param wantedDids - The DIDs to subscribe to.
 * @param maxMessageSizeBytes - The maximum size of messages to receive.
 * @returns The constructed subscription URL.
 */
export function jetstreamUrl (
  wantedCollections: string[] = [],
  wantedDids: string[] = [],
  maxMessageSizeBytes = 0
) {
  const url = new URL(JETSTREAM_URL)

  if (wantedCollections.length > 0) {
    url.searchParams.set("wantedCollections", wantedCollections.join(","))
  }

  if (wantedDids.length > 0) {
    url.searchParams.set("wantedDids", wantedDids.join(","))
  }

  if (maxMessageSizeBytes > 0) {
    url.searchParams.set("maxMessageSizeBytes", maxMessageSizeBytes.toString())
  }

  return url.toString()
}

/**
 * Builds a Jetstream event emitter to listen to messages from the Jetstream service.
 * 
 * @param wantedCollections - The collections to filter messages for.
 * @param wantedDids - The DIDs to filter messages for.
 * @param maxMessageSizeBytes - The maximum size of messages to process.
 * @returns A {@link JetstreamEventEmitter} instance.
 */
export function buildEventEmitter (
  wantedCollections: string[] = [],
  wantedDids: string[] = [],
  maxMessageSizeBytes = 0
): JetstreamEventEmitter {
  const eventEmitter: JetstreamEventEmitter = new EventEmitter()
  
  try {
    const url = jetstreamUrl(wantedCollections, wantedDids, maxMessageSizeBytes)
    const ws = new WebSocket(url)

    ws.on("message", async (buffer: Buffer<ArrayBufferLike>) => {
      try {
        const data = await decompressJetstreamZstd(buffer)
        const message = JSON.parse(data.toString()) as JetstreamMessage
        eventEmitter.emit("message", message)
      } catch {
        eventEmitter.emit("error", new Error("Failed to parse message from Jetstream"))
      }
    })

    ws.on("error", (error) => {
      eventEmitter.emit("error", error)
    })

    ws.on("close", () => {
      eventEmitter.emit("error", new Error("Jetstream connection closed"))
    })
  } catch {
    eventEmitter.emit("error", new Error("Failed to connect to Jetstream"))
  }

  return eventEmitter
}
