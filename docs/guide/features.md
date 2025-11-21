# Features

Trotsky is currently limited to the following features:

 **Name** | **Status** | **Description** | **Example** 
---|---|---|---
 **StepActor** | :white_check_mark: | Get an actor by its DID or handle. | ```Trotsky.init(agent).actor('bsky.app')``` 
 **StepActorBlock** | :white_check_mark: | Block an actor. | ```Trotsky.init(agent).actor('bsky.app').block()``` 
 **StepActorFollow** | :white_check_mark: | Follow an actor. | ```Trotsky.init(agent).actor('bsky.app').follow()``` 
 **StepActorFollowers** | :white_check_mark: | Get an actor's followers. | ```Trotsky.init(agent).actor('bsky.app').followers().each()``` 
 **StepActorFollowings** | :white_check_mark: | Get an actor's followings | ```Trotsky.init(agent).actor('bsky.app').followings().each()``` 
 **StepActorLikes** | :white_check_mark: | Get an actor's likes. | ```Trotsky.init(agent).actor('bsky.app').likes().each()``` 
 **StepActorLists** | :white_check_mark: | Get an actor's lists. | ```Trotsky.init(agent).actor('bsky.app').lists().each()``` 
 **StepActorMute** | :white_check_mark: | Mute an actor. | ```Trotsky.init(agent).actor('bsky.app').mute()```  
 **StepActorPosts** | :white_check_mark: | Get an actor's posts | ```Trotsky.init(agent).actor('bsky.app').posts().each()``` 
 **StepActors** | :white_check_mark: | Get a list of actors by their DIDs or handles. | ```Trotsky.init(agent).actors(['bsky.app', 'trotsky.pirhoo.com']).each()``` 
 **StepActorStarterPacks** | :x: | Get an actor starter packs. | 
 **StepActorStreamPosts** | :test_tube: | Stream an actor's posts. | ```Trotsky.init(agent).actor('bsky.app').streamPosts().each()``` 
 **StepActorUnblock** | :white_check_mark: | Unblock an actor. | ```Trotsky.init(agent).actor('bsky.app').unblock()``` 
 **StepActorUnfollow** | :white_check_mark: | Unfollow an actor. | ```Trotsky.init(agent).actor('bsky.app').unfollow()``` 
 **StepActorUnmute** | :white_check_mark: | Unmute an actor. | ```Trotsky.init(agent).actor('bsky.app').unmute()```  
 **StepCreatePost** | :white_check_mark: | Create a post. | ```Trotsky.init(agent).post({ text: "Mapo Tofu is spicy 🌶️" })``` 
 **StepList** | :white_check_mark: | Get a list by its URI. | ```Trotsky.init(agent).list("at://did:plc:4cs4fudwvazeed2f4b6zjkj5/app.bsky.graph.list/3lbmn7qvjfr2m")``` 
 **StepListMembers** | :white_check_mark: | Get a list's members. | ```Trotsky.init(agent).list("at://did:plc:4cs4fudwvazeed2f4b6zjkj5/app.bsky.graph.list/3lbmn7qvjfr2m").members().each()``` 
 **StepLists** | :x: | Get a list of list by their URIs. |
 **StepPost** | :white_check_mark: | Get a post by its URI. | ```Trotsky.init(agent).post("at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.post/3l6oveex3ii2l")``` 
 **StepPostAuthor** | :white_check_mark: | Get a post author. | ```Trotsky.init(agent).post("at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.post/3l6oveex3ii2l").author()``` 
 **StepPostLike** | :white_check_mark: | Like a post. | ```Trotsky.init(agent).post("at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.post/3l6oveex3ii2l").like()``` 
 **StepPostReply** | :white_check_mark: | Reply to a post. | ```Trotsky.init(agent).post("at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.post/3l6oveex3ii2l").reply({ text: "Well done!" })``` 
 **StepPostRepost** | :white_check_mark: | Repost a post. | ```Trotsky.init(agent).post("at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.post/3l6oveex3ii2l").repost()``` 
 **StepPosts** | :white_check_mark: | Get a list of post by their URIs. |  ```Trotsky.init(agent).posts(["at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.post/3l6oveex3ii2l"]).each()``` 
 **StepSearchPosts** | :white_check_mark: | Search posts. | ```Trotsky.init(agent).searchPosts({ q: "Mapo Tofu" }).each()``` 
 **StepSearchStarterPacks** | :x: | Search starter packs. |
 **StepStarterPack** | :x: | Get a start pack by its URI. | 
 **StepStarterPacks** | :x: | Get a list of starter packs by their URIs. |
 **StepStreamPosts** | :test_tube: | Use the firehose to stream posts. | ```Trotsky.init(agent).streamPosts().each()```
 **StepTimeline** | :x: | Get the timeline. |  

 <small>:x: Not implemented :white_check_mark: Implemented :test_tube: Experimental</small>

<style scoped>
.vp-doc table {
  white-space: nowrap;
}
</style>