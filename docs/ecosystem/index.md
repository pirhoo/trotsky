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
        .when((step) => step?.context?.record?.text.includes('python'))
        .like()
        .run()
}

main()
```
