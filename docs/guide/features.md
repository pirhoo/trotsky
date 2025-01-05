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
 **StepActorMute** | :x: | Mute an actor. |  
 **StepActorPosts** | :white_check_mark: | Get an actor's posts | ```Trotsky.init(agent).actor('bsky.app').posts().each()``` 
 **StepActors** | :x: | Get a list of actors by their DIDs or handles. |  
 **StepActorStreamPosts** | :white_check_mark: | Stream an actor's posts. | ```Trotsky.init(agent).actor('bsky.app').streamPost().each()``` 
 **StepActorUnblock** | :white_check_mark: | Unblock an actor. | ```Trotsky.init(agent).actor('bsky.app').unblock()``` 
 **StepActorUnfollow** | :white_check_mark: | Unfollow an actor. | ```Trotsky.init(agent).actor('bsky.app').unfollow()``` 
 **StepActorUnmute** | :x: | Unmute an actor. |  
 **StepCreatePost** | :white_check_mark: | Create a post. | ```Trotsky.init(agent).post({ text: "Mapo Tofu is spicy 🌶️" })``` 
 **StepPost** | :white_check_mark: | Get a post by its URI. | ```Trotsky.init(agent).post("at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.post/3l6oveex3ii2l")``` 
 **StepPostLike** | :white_check_mark: | Like a post. | ```Trotsky.init(agent).post("at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.post/3l6oveex3ii2l").like()``` 
 **StepPostReply** | :white_check_mark: | Reply to a post. | ```Trotsky.init(agent).post("at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.post/3l6oveex3ii2l").reply({ text: "Well done!" })``` 
 **StepPostRepost** | :white_check_mark: | Repost a post. | ```Trotsky.init(agent).post("at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.post/3l6oveex3ii2l").repost()``` 
 **StepPosts** | :x: | Get a list of post by their URIs. |  
 **StepSearchPosts** | :white_check_mark: | Search posts. | ```Trotsky.init(agent).searchPosts({ q: "Mapo Tofu" }).each()``` 
 **StepTimeline** | :x: | Get the timeline. |  
 **StreamPosts** | :white_check_mark: | Use the firehose to stream posts. | ```Trotsky.init(agent).streamPost().each()```

 <small>:x: Not implemented :white_check_mark: Implemented</small>

<style scoped>
.vp-doc table {
  white-space: nowrap;
}
</style>