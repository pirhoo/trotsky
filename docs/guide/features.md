# Features

Trotsky provides comprehensive support for the Bluesky AT Protocol. Below is a list of currently implemented features and planned additions.

## Implemented Features

 **Name** | **Status** | **Description** | **Example**
---|---|---|---
 **StepActor** | :white_check_mark: | Get an actor by its DID or handle. | ```Trotsky.init(agent).actor('bsky.app')```
 **StepActorBlock** | :white_check_mark: | Block an actor. | ```Trotsky.init(agent).actor('bsky.app').block()```
 **StepActorFollow** | :white_check_mark: | Follow an actor. | ```Trotsky.init(agent).actor('bsky.app').follow()```
 **StepActorFollowers** | :white_check_mark: | Get an actor's followers. | ```Trotsky.init(agent).actor('bsky.app').followers().each()```
 **StepActorFollowings** | :white_check_mark: | Get an actor's followings. | ```Trotsky.init(agent).actor('bsky.app').followings().each()```
 **StepActorLikes** | :white_check_mark: | Get an actor's likes. | ```Trotsky.init(agent).actor('bsky.app').likes().each()```
 **StepActorLists** | :white_check_mark: | Get an actor's lists. | ```Trotsky.init(agent).actor('bsky.app').lists().each()```
 **StepActorMute** | :white_check_mark: | Mute an actor. | ```Trotsky.init(agent).actor('bsky.app').mute()```
 **StepActorPosts** | :white_check_mark: | Get an actor's posts. | ```Trotsky.init(agent).actor('bsky.app').posts().each()```
 **StepActors** | :white_check_mark: | Get a list of actors by their DIDs or handles. | ```Trotsky.init(agent).actors(['bsky.app', 'handle']).each()```
 **StepActorStarterPacks** | :white_check_mark: | Get an actor's starter packs. | ```Trotsky.init(agent).actor('bsky.app').starterPacks().each()```
 **StepActorStreamPosts** | :test_tube: | Stream an actor's posts. | ```Trotsky.init(agent).actor('bsky.app').streamPosts().each()```
 **StepActorUnblock** | :white_check_mark: | Unblock an actor. | ```Trotsky.init(agent).actor('bsky.app').unblock()```
 **StepActorUnfollow** | :white_check_mark: | Unfollow an actor. | ```Trotsky.init(agent).actor('bsky.app').unfollow()```
 **StepActorUnmute** | :white_check_mark: | Unmute an actor. | ```Trotsky.init(agent).actor('bsky.app').unmute()```
 **StepCreatePost** | :white_check_mark: | Create a post. | ```Trotsky.init(agent).createPost({ text: "Hello!" })```
 **StepList** | :white_check_mark: | Get a list by its URI. | ```Trotsky.init(agent).list("at://did:plc:example/app.bsky.graph.list/listid")```
 **StepListMembers** | :white_check_mark: | Get a list's members. | ```Trotsky.init(agent).list("at://...").members().each()```
 **StepLists** | :white_check_mark: | Get a list of lists by their URIs. | ```Trotsky.init(agent).lists([uri1, uri2]).each()```
 **StepPost** | :white_check_mark: | Get a post by its URI. | ```Trotsky.init(agent).post("at://did:plc:example/app.bsky.feed.post/postid")```
 **StepPostAuthor** | :white_check_mark: | Get a post's author. | ```Trotsky.init(agent).post("at://...").author()```
 **StepPostLike** | :white_check_mark: | Like a post. | ```Trotsky.init(agent).post("at://...").like()```
 **StepPostReply** | :white_check_mark: | Reply to a post. | ```Trotsky.init(agent).post("at://...").reply({ text: "Great!" })```
 **StepPostRepost** | :white_check_mark: | Repost a post. | ```Trotsky.init(agent).post("at://...").repost()```
 **StepPosts** | :white_check_mark: | Get a list of posts by their URIs. |  ```Trotsky.init(agent).posts([uri1, uri2]).each()```
 **StepSearchPosts** | :white_check_mark: | Search posts. | ```Trotsky.init(agent).searchPosts({ q: "TypeScript" }).each()```
 **StepSearchStarterPacks** | :white_check_mark: | Search starter packs. | ```Trotsky.init(agent).searchStarterPacks({ q: "tech" }).each()```
 **StepStarterPack** | :white_check_mark: | Get a starter pack by its URI. | ```Trotsky.init(agent).starterPack("at://...").run()```
 **StepStarterPacks** | :white_check_mark: | Get a list of starter packs by their URIs. | ```Trotsky.init(agent).starterPacks([uri1, uri2]).each()```
 **StepStreamPosts** | :test_tube: | Stream posts from the firehose. | ```Trotsky.init(agent).streamPosts().each()```
 **StepTimeline** | :white_check_mark: | Get the authenticated user's timeline. | ```Trotsky.init(agent).timeline().take(20).each()```
 **StepSearchActors** | :white_check_mark: | Search for actors by name/handle. | ```Trotsky.init(agent).searchActors({ q: "typescript" }).each()```
 **StepPostLikers** | :white_check_mark: | Get actors who liked a post. | ```Trotsky.init(agent).post("at://...").likers().each()```
 **StepPostReposters** | :white_check_mark: | Get actors who reposted a post. | ```Trotsky.init(agent).post("at://...").reposters().each()```
 **StepPostQuotes** | :white_check_mark: | Get quote posts of a post. | ```Trotsky.init(agent).post("at://...").quotes().each()```
 **StepPostThread** | :white_check_mark: | Get a full post thread with replies. | ```Trotsky.init(agent).post("at://...").thread()```
 **StepPostUnlike** | :white_check_mark: | Unlike a post. | ```Trotsky.init(agent).post("at://...").unlike()```
 **StepPostUnrepost** | :white_check_mark: | Unrepost a post. | ```Trotsky.init(agent).post("at://...").unrepost()```
 **StepDeletePost** | :white_check_mark: | Delete a post. | ```Trotsky.init(agent).post("at://...").delete()```
 **StepActorBlocks** | :white_check_mark: | Get all actors blocked by the user. | ```Trotsky.init(agent).blocks().each()```
 **StepActorMutes** | :white_check_mark: | Get all actors muted by the user. | ```Trotsky.init(agent).mutes().each()```
 **StepActorKnownFollowers** | :white_check_mark: | Get known followers (mutual connections). | ```Trotsky.init(agent).actor('bsky.app').knownFollowers().each()```
 **StepActorSuggestions** | :white_check_mark: | Get suggested actors to follow. | ```Trotsky.init(agent).suggestions().each()```
 **StepFeed** | :white_check_mark: | Get posts from a custom feed. | ```Trotsky.init(agent).feed("at://...").each()```
 **StepFeedGenerator** | :white_check_mark: | Get a custom feed generator. | ```Trotsky.init(agent).feedGenerator("at://...")```
 **StepSuggestedFeeds** | :white_check_mark: | Get suggested custom feeds. | ```Trotsky.init(agent).suggestedFeeds().take(10)```
 **StepListFeed** | :white_check_mark: | Get posts from a list feed. | ```Trotsky.init(agent).list("at://...").feed().each()```
 **StepListBlock** | :white_check_mark: | Block a list. | ```Trotsky.init(agent).list("at://...").block()```
 **StepListUnblock** | :white_check_mark: | Unblock a list. | ```Trotsky.init(agent).list("at://...").unblock()```

## Planned Features

The following features are planned for future implementation:

 **Name** | **Status** | **Description** | **Potential API**
---|---|---|---
 **StepListMute** | :construction: | Mute a list. | `app.bsky.graph.muteActorList`
 **StepListUnmute** | :construction: | Unmute a list. | `app.bsky.graph.unmuteActorList`
 **StepNotifications** | :construction: | Get user notifications. | `app.bsky.notification.listNotifications`
 **StepNotificationsUnreadCount** | :construction: | Get unread notification count. | `app.bsky.notification.getUnreadCount`
 **StepNotificationsUpdateSeen** | :construction: | Mark notifications as seen. | `app.bsky.notification.updateSeen`
 **StepThreadMute** | :construction: | Mute a thread. | `app.bsky.graph.muteThread`
 **StepThreadUnmute** | :construction: | Unmute a thread. | `app.bsky.graph.unmuteThread`

 <small>:white_check_mark: Implemented • :test_tube: Experimental • :x: In PR/Review • :construction: Planned</small>

<style scoped>
.vp-doc table {
  white-space: nowrap;
}
</style>
