# Why Trotsky?

**Trotsky** was born out of the desire to make automating actions on [Bluesky](https://blueskyweb.xyz/) both **friendly** and **highly flexible**. While the official [`@atproto/api`](https://github.com/bluesky-social/atproto) library provides a raw (and powerful) interface for interacting with the protocol, many developers might found themselves writing the same boilerplate code over and over. Trotsky emerged as a **domain-specific language** (DSL) and **builder pattern** abstraction to tackle these challenges.


One of the core motivations behind Trotsky is to **streamline common sequences of actions* (like searching posts, replying, following, liking, etc.) which typically require juggling multiple API calls. For example, if you want to find posts that mention a certain keyword, reply to each with a friendly message, and then wait a few seconds before processing the next post, you’d need to:

1. Use the API to search posts by a keyword.  
2. Iterate over each post in the search results.  
3. For each post, construct a request to reply.  
4. Optionally insert a wait or delay.  
5. Catch and handle errors or timeouts if something goes wrong.  

With Trotsky, these steps transform into a simple, chainable sequence:  

```ts
await Trotsky.init(agent)
  .searchPosts({ q: "keyword" })
    .take(10)
    .each()
      .reply({ text: "Hello!" })
      .wait(1000)
      .run()
```

This **readability** and **ease of composition** reduces cognitive load and makes your automation script far more self-documenting.

Under the hood, Trotsky leverages the existing [`@atproto/api`](https://github.com/bluesky-social/atproto) client library, so it remains **fully compatible** with Bluesky’s protocol while providing extra safety and convenience. TypeScript’s type system helps ensure that each step in a Trotsky flow is well-defined, reducing runtime errors and mistakes.

A clear sense of scope was also important. Trotsky **focuses** on tasks that developers consistently find useful—like searching posts, creating posts, following an account, blocking or unblocking an actor, etc. Certain features like muting an actor or fetching a raw timeline are not yet implemented, because the team has prioritized the most frequently requested capabilities first. Over time, Trotsky’s coverage of the entire Bluesky API can expand as community needs evolve.

Its mission is to stand as a **friendly entry point** into Bluesky’s automation scene, letting developers focus on what they want to accomplish rather than how they need to accomplish it.