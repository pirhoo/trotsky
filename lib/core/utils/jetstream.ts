import type { Did, FollowRecord, LikeRecord, PostRecord } from "@atproto/api"
import WebSocket from "ws"
import EventEmitter from "events"

import { decompressJetstreamZstd } from "./zstd"

export interface JetstreamMessageBase {
  "did": Did;
  "time_us": number;
  "kind": "commit" | "identity" | "account";
}

export interface JetstreamMessageCommit extends JetstreamMessageBase {
  "commit": {
    "rev": string;
    "operation": "create" | "update" | "delete";
    "collection": string;
    "rkey": string;
    "cid"?: string;
    "record"?: Partial<PostRecord> | Partial<LikeRecord> | Partial<FollowRecord>;
  };
}

export interface JetstreamMessageIdentity extends JetstreamMessageBase {
  "identity": {
    "did": Did;
    "handle": string;
    "seq": number;
    "time": string;
  };
}

export interface JetstreamMessageAccount extends JetstreamMessageBase {
  "account": {
    "active": boolean;
    "did": Did;
    "seq": number;
    "time": string;
  };
}

export type JetstreamMessage = JetstreamMessageCommit | JetstreamMessageIdentity | JetstreamMessageAccount

export type JetstreamEventTypes = {
  "error": [error: Error];
  "message": [message: JetstreamMessage];
}

export type JetstreamEventEmitter = EventEmitter<JetstreamEventTypes>

const JETSTREAM_URL = "wss://jetstream1.us-east.bsky.network/subscribe?compress=true"

export function jetstreamUrl (wantedCollections: string[] = [], wantedDids: string[] = [], maxMessageSizeBytes = 0) {
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

export function buildEventEmitter (wantedCollections: string[] = [], wantedDids: string[] = [], maxMessageSizeBytes = 0) {
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
  } catch {    
    eventEmitter.emit("error", new Error("Failed to connect to Jetstream"))
  }

  return eventEmitter
}