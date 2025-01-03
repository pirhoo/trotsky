# Trotsky

**Trotsky** is a TypeScript library that provides a simple DSL with a [builder pattern](https://en.wikipedia.org/wiki/Builder_pattern) to automate actions on [Bluesky](https://bsky.social) using [@atproto/api](https://github.com/bluesky-social/atproto).

- [Installation](#installation)
- [Features](#features)
- [Usage](#usage)
  - [Initialization](#initialization)
  - [Example: Follow Followers and Followings](#example-follow-followers-and-followings)
    - [Explanation](#explanation)
  - [Example: Search and Reply to Posts](#example-search-and-reply-to-posts)
    - [Explanation](#explanation-1)

---

## Installation

```bash
npm install trotsky
```

Or with Yarn:

```bash
yarn add trotsky
```

> **Note**: Make sure you also install the [@atproto/api](https://github.com/bluesky-social/atproto) package, as Trotsky depends on it for Bluesky interactions.

---

## Features

- **Fluent DSL** to build automation flows in a descriptive way.
- **Builder Pattern** that makes your automation steps easy to read and maintain.
- **Typed** with TypeScript for a safer developer experience.

---

## Usage

Below are examples demonstrating how to use Trotsky to build automation flows. Each flow is a sequence of steps that Trotsky will execute in order. 

### Initialization

1. **Import** the required classes from Trotsky.
2. **Create** an `AtpAgent` instance (from the `@atproto/api` package).
3. **Initialize** Trotsky with your agent.

```ts
import { AtpAgent } from "@atproto/api"
import { Trotsky } from "trotsky"

const agent = new AtpAgent({ service: "https://bsky.social" })
// Assuming you logged in with your agent, for instance using the login method
// such as: await agent.login({ identifier: 'trotsky.pirhoo.com', password: 'horse' })
const trotsky = Trotsky.init(agent)
```

After initializing, you can chain the steps you want Trotsky to perform.

---

### Example: Follow Followers and Followings

Suppose you want to:

1. **Specify** a Bluesky actor (e.g., `alice.test`).
2. **Wait** for 10 seconds.
3. **Retrieve** the actor’s first 10 followers and follow each.
4. **Retrieve** the actor’s first 10 followings and follow each.

Here is how you can build this flow with Trotsky:

```ts
import { Trotsky } from "trotsky"
import { AtpAgent } from "@atproto/api"

async function main() {
  const agent = new AtpAgent({ service: "https://bsky.social" })

  const trotsky = Trotsky
    .init(agent)
      .actor("alice.test")
      .wait(10_000)
        .followers()
          .take(10)
          .each()
            .follow()
            .back()
          .back()
        .followings()
          .take(10)
          .each()
            .follow()
            .end()

  await trotsky.run()
}

main()
```

#### Explanation

- **`actor("alice.test")`**  
  Specifies the primary actor you are working with (e.g., to get their followers, follow them, etc.).
- **`wait(10_000)`**  
  Pauses for 10 seconds (10,000 ms) before moving to the next step.  
- **`followers().take(10).each().follow()`**  
  Retrieves the first 10 followers of `alice.test`, then for each one, executes a follow.  
- **`followings().take(10).each().follow()`**  
  Similarly, retrieves the first 10 accounts that `alice.test` is following, and follows each.

---

### Example: Search and Reply to Posts

Let’s say you want to:

1. **Search** for posts containing "foo".
2. **Take** the first 10 matching posts.
3. **Reply** to each post with the text "bar".
4. **Wait** 1 second between each reply.

Use the following flow:

```ts
import { Trotsky } from "trotsky"
import { AtpAgent } from "@atproto/api"

async function main() {
  const agent = new AtpAgent({ service: "https://bsky.social" })
  
  const trotsky = Trotsky
    .init(agent)
    .searchPosts({ q: "foo" })
      .take(10)
      .each()
        .reply({ text: "bar" })
        .wait(1_000)
        .end()

  await trotsky.run()
}

main()
```

#### Explanation

- **`searchPosts({ q: "foo" })`**  
  Searches for posts matching the query `"foo"`.
- **`take(10)`**  
  Limits the results to the first 10 posts from the search results.
- **`each().reply({ text: "bar" })`**  
  For each post in that set, replies with the text `"bar"`.
- **`wait(1_000)`**  
  After replying, waits 1 second before processing the next post.

---

> _Trotsky is not affiliated with nor endorsed by Bluesky. Use responsibly._