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

## Planned Features

The following features are planned for future implementation:

 **Name** | **Status** | **Description** | **Potential API**
---|---|---|---
 **StepActorBlocks** | :construction: | Get all actors blocked by the user. | `app.bsky.graph.getBlocks`
 **StepActorKnownFollowers** | :construction: | Get known followers (mutual connections). | `app.bsky.graph.getKnownFollowers`
 **StepActorMutes** | :construction: | Get all actors muted by the user. | `app.bsky.graph.getMutes`
 **StepActorSuggestions** | :construction: | Get suggested actors to follow. | `app.bsky.actor.getSuggestions`
 **StepDeletePost** | :construction: | Delete a post. | Delete post record
 **StepFeed** | :construction: | Get posts from a custom feed. | `app.bsky.feed.getFeed`
 **StepFeedGenerator** | :construction: | Get a custom feed generator. | `app.bsky.feed.getFeedGenerator`
 **StepListBlock** | :construction: | Block a list. | `app.bsky.graph.listblock`
 **StepListFeed** | :construction: | Get posts from a list feed. | `app.bsky.feed.getListFeed`
 **StepListMute** | :construction: | Mute a list. | `app.bsky.graph.muteActorList`
 **StepListUnblock** | :construction: | Unblock a list. | Delete listblock record
 **StepListUnmute** | :construction: | Unmute a list. | `app.bsky.graph.unmuteActorList`
 **StepNotifications** | :construction: | Get user notifications. | `app.bsky.notification.listNotifications`
 **StepNotificationsUnreadCount** | :construction: | Get unread notification count. | `app.bsky.notification.getUnreadCount`
 **StepNotificationsUpdateSeen** | :construction: | Mark notifications as seen. | `app.bsky.notification.updateSeen`
 **StepPostLikers** | :construction: | Get actors who liked a post. | `app.bsky.feed.getLikes`
 **StepPostQuotes** | :construction: | Get quote posts of a post. | `app.bsky.feed.getQuotes`
 **StepPostReposters** | :construction: | Get actors who reposted a post. | `app.bsky.feed.getRepostedBy`
 **StepPostThread** | :construction: | Get a full post thread with replies. | `app.bsky.feed.getPostThread`
 **StepPostUnlike** | :construction: | Unlike a post. | Delete like record
 **StepPostUnrepost** | :construction: | Unrepost a post. | Delete repost record
 **StepSearchActors** | :construction: | Search for actors by name/handle. | `app.bsky.actor.searchActors`
 **StepSuggestedFeeds** | :construction: | Get suggested custom feeds. | `app.bsky.feed.getSuggestedFeeds`
 **StepThreadMute** | :construction: | Mute a thread. | `app.bsky.graph.muteThread`
 **StepThreadUnmute** | :construction: | Unmute a thread. | `app.bsky.graph.unmuteThread`

 <small>:white_check_mark: Implemented • :test_tube: Experimental • :x: In PR/Review • :construction: Planned</small>

<style scoped>
.vp-doc table {
  white-space: nowrap;
}
</style>
