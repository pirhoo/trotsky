# Ecosystem

Welcome to the **Trotsky Ecosystem** page—your one-stop hub for sharing ideas, scripts, and best practices you’ve built with Trotsky. The goal is to highlight community-driven creativity, help newcomers discover powerful workflows, and inspire innovation on Bluesky!

Have you built a neat automation script, a quirky bot, or an interesting chain of steps with Trotsky yet? **We want to see it!** Feel free to share your code examples with us, either by opening an [issue on Github](https://github.com/pirhoo/trotsky/issues) or directly submitting a PR to edit this document.

## Bots

### Big Ben

This script posts just like [Big Ben](https://bsky.app/profile/bigbenbong.bsky.social) (largely inspired by [Big Ben Clock on X](https://x.com/big_ben_clock)), every hour:

```ts
import { AtpAgent } from "@atproto/api"
import { Trotsky } from "trotsky"

async function main() {
  const agent = new AtpAgent({ service: "https://bsky.social" })
  await agent.login({ identifier: 'trotsky.pirhoo.com', password: 'p4ssw0rd' })

  Trotsky
    .init(agent)
    .createPost(function () {
      const londonDate = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London', hour: 'numeric', hour12: false })
      const hours = (parseInt(londonDate, 10) % 12) || 12
      const text = 'BONG '.repeat(hours).trim()
      return { text }
    })
    .schedule('0 * * * *')
}

main()
```



### Pizza Party

This script finds 3 posts mentioning "pizza", replies and waits 1 second:

```ts
import { AtpAgent } from "@atproto/api"
import { Trotsky } from "trotsky"

async function main() {
  const agent = new AtpAgent({ service: "https://bsky.social" })
  await agent.login({ identifier: 'trotsky.pirhoo.com', password: 'p4ssw0rd' })

  await Trotsky.init(agent)
    .searchPosts({ q: "pizza" })
      .take(3)
      .each()
        .reply({ text: "🍕 Pizza party! 🍕" })
        .wait(1000)
        .run()
}

main()
```

### Mapo Tofu fan

This script streams posts mentioning "mapo tofu" and likes them:

```ts
import { AtpAgent } from "@atproto/api"
import { Trotsky } from "trotsky"

async function main() {
  const agent = new AtpAgent({ service: "https://bsky.social" })
  await agent.login({ identifier: "trotsky.pirhoo.com", password: "p4ssw0rd" })

  await Trotsky
    .init(agent)
    // The `streamPosts` uses Bluesky Firehose to get all
    // posts in real-time. This feature is experimental
    // and might use a lot of bandwidth so use with caution!
    .streamPosts()
      .each()
        .when((step) => step?.context?.record?.text.includes('mapo tofu'))
        .like()
        .run()
}

main()
```

## Automation Workflows

### Follow Back Bot

This script automatically follows back anyone who follows you:

```ts
import { AtpAgent } from "@atproto/api"
import { Trotsky } from "trotsky"

async function main() {
  const agent = new AtpAgent({ service: "https://bsky.social" })
  await agent.login({ identifier: "trotsky.pirhoo.com", password: "p4ssw0rd" })

  const myHandle = "trotsky.pirhoo.com"

  await Trotsky
    .init(agent)
    .actor(myHandle)
      .followers()
        .each()
          // Only follow if not already following
          .when((step) => !step?.context?.viewer?.following)
          .follow()
          .wait(2000) // Be nice to the API
          .run()
}

main()
```

### Mutual Follow Checker

Check which of your followings also follow you back:

```ts
import { AtpAgent } from "@atproto/api"
import { Trotsky } from "trotsky"

async function main() {
  const agent = new AtpAgent({ service: "https://bsky.social" })
  await agent.login({ identifier: "trotsky.pirhoo.com", password: "p4ssw0rd" })

  const myHandle = "trotsky.pirhoo.com"

  await Trotsky
    .init(agent)
    .actor(myHandle)
      .followings()
        .each()
          .tap((step) => {
            const actor = step?.context
            const isMutual = actor?.viewer?.followedBy
            if (isMutual) {
              console.log(`✅ ${actor.handle} follows you back`)
            } else {
              console.log(`❌ ${actor.handle} doesn't follow back`)
            }
          })
          .run()
}

main()
```

### Engagement Booster

Like and repost your friends' latest posts:

```ts
import { AtpAgent } from "@atproto/api"
import { Trotsky } from "trotsky"

async function main() {
  const agent = new AtpAgent({ service: "https://bsky.social" })
  await agent.login({ identifier: "trotsky.pirhoo.com", password: "p4ssw0rd" })

  const friends = ["alice.bsky.social", "bob.bsky.social", "carol.bsky.social"]

  await Trotsky
    .init(agent)
    .actors(friends)
      .each()
        .posts()
          .take(3) // Only their 3 most recent posts
          .each()
            .like()
            .wait(1000)
            .repost()
            .wait(1000)
            .run()
}

main()
```

### Content Curator

Save interesting posts to a JSON file for later review:

```ts
import { AtpAgent } from "@atproto/api"
import { Trotsky } from "trotsky"

async function main() {
  const agent = new AtpAgent({ service: "https://bsky.social" })
  await agent.login({ identifier: "trotsky.pirhoo.com", password: "p4ssw0rd" })

  await Trotsky
    .init(agent)
    .searchPosts({ q: "typescript tips" })
      .take(20)
      .each()
        .when((step) => step?.context?.likeCount > 10)
        .save("typescript-tips.json")
        .run()
}

main()
```

### Welcome Bot

Welcome new followers with a personalized post:

```ts
import { AtpAgent } from "@atproto/api"
import { Trotsky } from "trotsky"

async function main() {
  const agent = new AtpAgent({ service: "https://bsky.social" })
  await agent.login({ identifier: "trotsky.pirhoo.com", password: "p4ssw0rd" })

  const myHandle = "trotsky.pirhoo.com"

  await Trotsky
    .init(agent)
    .actor(myHandle)
      .followers()
        .take(5) // Check the 5 most recent followers
        .each()
          .tap((step) => {
            const follower = step?.context
            console.log(`New follower: ${follower?.handle}`)
          })
          .when((step) => {
            // Check if this is a new follower (custom logic needed)
            const createdAt = step?.context?.viewer?.following
            return !createdAt // Only welcome if we're not following them yet
          })
          .posts()
            .take(1)
            .each()
              .reply((step) => ({
                text: `Thanks for the follow! 👋`
              }))
              .wait(3000)
              .run()
}

main()
```

## List Management

### Populate a List

Add members to a Bluesky list based on criteria:

```ts
import { AtpAgent } from "@atproto/api"
import { Trotsky } from "trotsky"

async function main() {
  const agent = new AtpAgent({ service: "https://bsky.social" })
  await agent.login({ identifier: "trotsky.pirhoo.com", password: "p4ssw0rd" })

  const myHandle = "trotsky.pirhoo.com"

  await Trotsky
    .init(agent)
    .actor(myHandle)
      .followings()
        .each()
          .when((step) => {
            const bio = step?.context?.description || ""
            return bio.toLowerCase().includes("typescript")
          })
          .tap((step) => {
            console.log(`Found TypeScript dev: ${step?.context?.handle}`)
          })
          .run()
}

main()
```

### List Members Export

Export all members of a list to analyze:

```ts
import { AtpAgent } from "@atproto/api"
import { Trotsky } from "trotsky"

async function main() {
  const agent = new AtpAgent({ service: "https://bsky.social" })
  await agent.login({ identifier: "trotsky.pirhoo.com", password: "p4ssw0rd" })

  const listUri = "at://did:plc:example/app.bsky.graph.list/listid"

  await Trotsky
    .init(agent)
    .list(listUri)
      .members()
        .each()
          .tap((step) => {
            const member = step?.context
            console.log(`${member?.handle} - ${member?.displayName}`)
          })
          .save("list-members.json")
          .run()
}

main()
```

## Content Discovery

### Trending Topics Tracker

Track and log posts about trending topics:

```ts
import { AtpAgent } from "@atproto/api"
import { Trotsky } from "trotsky"

async function main() {
  const agent = new AtpAgent({ service: "https://bsky.social" })
  await agent.login({ identifier: "trotsky.pirhoo.com", password: "p4ssw0rd" })

  const topics = ["#bluesky", "#atproto", "#typescript"]

  for (const topic of topics) {
    await Trotsky
      .init(agent)
      .searchPosts({ q: topic })
        .take(10)
        .each()
          .tap((step) => {
            const post = step?.context
            console.log(`[${topic}] ${post?.author?.handle}: ${post?.record?.text}`)
            console.log(`  ❤️ ${post?.likeCount} | 🔁 ${post?.repostCount}`)
          })
          .run()

    await new Promise(resolve => setTimeout(resolve, 2000))
  }
}

main()
```

### Discover New Accounts

Find interesting accounts based on engagement:

```ts
import { AtpAgent } from "@atproto/api"
import { Trotsky } from "trotsky"

async function main() {
  const agent = new AtpAgent({ service: "https://bsky.social" })
  await agent.login({ identifier: "trotsky.pirhoo.com", password: "p4ssw0rd" })

  await Trotsky
    .init(agent)
    .searchPosts({ q: "web development" })
      .take(50)
      .each()
        .when((step) => step?.context?.likeCount > 20)
        .author()
          .when((step) => {
            const followerCount = step?.context?.followersCount || 0
            return followerCount > 100 && followerCount < 10000
          })
          .tap((step) => {
            const author = step?.context
            console.log(`Interesting account: ${author?.handle}`)
            console.log(`  ${author?.description}`)
            console.log(`  Followers: ${author?.followersCount}`)
          })
          .run()
}

main()
```

### Popular Post Analyzer

Analyze your most popular posts:

```ts
import { AtpAgent } from "@atproto/api"
import { Trotsky } from "trotsky"

async function main() {
  const agent = new AtpAgent({ service: "https://bsky.social" })
  await agent.login({ identifier: "trotsky.pirhoo.com", password: "p4ssw0rd" })

  const myHandle = "trotsky.pirhoo.com"
  const popularPosts = []

  await Trotsky
    .init(agent)
    .actor(myHandle)
      .posts()
        .take(100)
        .each()
          .when((step) => step?.context?.likeCount > 5)
          .tap((step) => {
            const post = step?.context
            popularPosts.push({
              text: post?.record?.text,
              likes: post?.likeCount,
              reposts: post?.repostCount,
              replies: post?.replyCount
            })
          })
          .run()

  // Sort by likes
  popularPosts.sort((a, b) => b.likes - a.likes)

  console.log("Your top 10 posts:")
  popularPosts.slice(0, 10).forEach((post, i) => {
    console.log(`\n${i + 1}. ${post.text}`)
    console.log(`   ❤️ ${post.likes} | 🔁 ${post.reposts} | 💬 ${post.replies}`)
  })
}

main()
```

## Moderation & Cleanup

### Bulk Unmute

Unmute all muted accounts (use with caution):

```ts
import { AtpAgent } from "@atproto/api"
import { Trotsky } from "trotsky"

async function main() {
  const agent = new AtpAgent({ service: "https://bsky.social" })
  await agent.login({ identifier: "trotsky.pirhoo.com", password: "p4ssw0rd" })

  const { data: { mutes } } = await agent.app.bsky.graph.getMutes()

  await Trotsky
    .init(agent)
    .actors(mutes.map(m => m.did))
      .each()
        .unmute()
        .wait(1000)
        .tap((step) => {
          console.log(`Unmuted: ${step?.context?.handle}`)
        })
        .run()
}

main()
```

### Clean Up Old Posts

Find and delete your old posts with specific criteria:

```ts
import { AtpAgent } from "@atproto/api"
import { Trotsky } from "trotsky"

async function main() {
  const agent = new AtpAgent({ service: "https://bsky.social" })
  await agent.login({ identifier: "trotsky.pirhoo.com", password: "p4ssw0rd" })

  const myHandle = "trotsky.pirhoo.com"
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  await Trotsky
    .init(agent)
    .actor(myHandle)
      .posts()
        .each()
          .when((step) => {
            const post = step?.context
            const postDate = new Date(post?.indexedAt)
            const hasLowEngagement = post?.likeCount < 2
            return postDate < sixMonthsAgo && hasLowEngagement
          })
          .tap((step) => {
            const post = step?.context
            console.log(`Considering deletion: ${post?.record?.text}`)
            // Add deletion logic here using agent.deletePost()
          })
          .run()
}

main()
```

### Inactive Follower Cleanup

Find followers who haven't posted in a while:

```ts
import { AtpAgent } from "@atproto/api"
import { Trotsky } from "trotsky"

async function main() {
  const agent = new AtpAgent({ service: "https://bsky.social" })
  await agent.login({ identifier: "trotsky.pirhoo.com", password: "p4ssw0rd" })

  const myHandle = "trotsky.pirhoo.com"

  await Trotsky
    .init(agent)
    .actor(myHandle)
      .followings()
        .each()
          .posts()
            .take(1)
            .each()
              .when((step) => {
                const post = step?.context
                if (!post) return false

                const lastPost = new Date(post?.indexedAt)
                const threeMonthsAgo = new Date()
                threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

                return lastPost < threeMonthsAgo
              })
              .author()
                .tap((step) => {
                  const author = step?.context
                  console.log(`⚠️ Inactive: ${author?.handle} (last post over 3 months ago)`)
                })
                .run()
}

main()
```

## Advanced Patterns

### Multi-Step Thread Creator

Create a thread by replying to your own posts:

```ts
import { AtpAgent } from "@atproto/api"
import { Trotsky, StepCreatePost } from "trotsky"

async function main() {
  const agent = new AtpAgent({ service: "https://bsky.social" })
  await agent.login({ identifier: "trotsky.pirhoo.com", password: "p4ssw0rd" })

  const threadParts = [
    "1/ Let me tell you about TypeScript...",
    "2/ TypeScript adds static typing to JavaScript...",
    "3/ This helps catch errors at compile time...",
    "4/ And that's why TypeScript is awesome! 🚀"
  ]

  let previousPost: StepCreatePost | null = null

  for (const text of threadParts) {
    const step = Trotsky
      .init(agent)
      .createPost({
        text,
        reply: previousPost ? {
          root: previousPost.output,
          parent: previousPost.output
        } : undefined
      })

    await step.run()
    previousPost = step
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  console.log("Thread created!")
}

main()
```

### Conditional Engagement

Engage with posts based on complex criteria:

```ts
import { AtpAgent } from "@atproto/api"
import { Trotsky } from "trotsky"

async function main() {
  const agent = new AtpAgent({ service: "https://bsky.social" })
  await agent.login({ identifier: "trotsky.pirhoo.com", password: "p4ssw0rd" })

  await Trotsky
    .init(agent)
    .searchPosts({ q: "javascript" })
      .take(50)
      .each()
        // Complex engagement logic
        .when((step) => {
          const post = step?.context
          const hasEnoughEngagement = post?.likeCount > 5
          const isRecent = new Date(post?.indexedAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
          const notTooPopular = post?.likeCount < 100
          const hasGoodRatio = post?.replyCount < post?.likeCount * 0.3

          return hasEnoughEngagement && isRecent && notTooPopular && hasGoodRatio
        })
        .like()
        .wait(2000)
        .when((step) => step?.context?.likeCount > 20)
        .repost()
        .wait(2000)
        .run()
}

main()
```

### Scheduled Multi-Account Manager

Manage multiple accounts with scheduled posts:

```ts
import { AtpAgent } from "@atproto/api"
import { Trotsky } from "trotsky"

async function postToAccount(handle: string, password: string, text: string) {
  const agent = new AtpAgent({ service: "https://bsky.social" })
  await agent.login({ identifier: handle, password })

  await Trotsky
    .init(agent)
    .createPost({ text })
    .run()

  console.log(`Posted to ${handle}: ${text}`)
}

async function main() {
  const accounts = [
    { handle: "account1.bsky.social", password: "pass1" },
    { handle: "account2.bsky.social", password: "pass2" },
    { handle: "account3.bsky.social", password: "pass3" }
  ]

  for (const account of accounts) {
    await postToAccount(
      account.handle,
      account.password,
      `Good morning! Posted at ${new Date().toLocaleTimeString()}`
    )

    await new Promise(resolve => setTimeout(resolve, 5000))
  }
}

main()
```

### Cross-Platform Sync

Monitor your Bluesky activity and sync to other platforms:

```ts
import { AtpAgent } from "@atproto/api"
import { Trotsky } from "trotsky"

async function main() {
  const agent = new AtpAgent({ service: "https://bsky.social" })
  await agent.login({ identifier: "trotsky.pirhoo.com", password: "p4ssw0rd" })

  const myHandle = "trotsky.pirhoo.com"
  const syncedPosts = new Set() // Track what we've synced

  await Trotsky
    .init(agent)
    .actor(myHandle)
      .posts()
        .take(10)
        .each()
          .when((step) => {
            const postUri = step?.context?.uri
            return !syncedPosts.has(postUri)
          })
          .tap((step) => {
            const post = step?.context
            const text = post?.record?.text

            // Sync to other platforms (pseudo-code)
            console.log(`Syncing to other platforms: ${text}`)
            // await syncToTwitter(text)
            // await syncToMastodon(text)

            syncedPosts.add(post?.uri)
          })
          .run()
}

main()
```
