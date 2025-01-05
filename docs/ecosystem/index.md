# Ecosystem

Welcome to the **Trotsky Ecosystem** page—your one-stop hub for sharing ideas, scripts, and best practices you’ve built with Trotsky. The goal is to highlight community-driven creativity, help newcomers discover powerful workflows, and inspire innovation on Bluesky!

Have you built a neat automation script, a quirky bot, or an interesting chain of steps with Trotsky yet? **We want to see it!** Feel free to share your code examples with us, etheir by openning an [issue on Github](https://github.com/pirhoo/trotsky/issues) or directly submitting a PR to edit this document.

## Reply-bots

### Pizza Party

This script finds 3 posts mentioning "pizza" and replies, waiting 1 second between each reply.

```ts
import { Trotsky } from "trotsky"
import { AtpAgent } from "@atproto/api"

async function main() {
  const agent = new AtpAgent({ service: "https://bsky.social" })
  await agent.login({ identifier: 'trotsky.pirhoo.com', password: 'p4ssw0rd' })

  Trotsky.init(agent)
    .searchPosts({ q: "pizza" })
      .take(3)
      .each()
        .reply({ text: "🍕 Pizza party! 🍕" })
        .wait(1000)
        .end()
}

main()
```

### Mapo Tofu fan

This script stream posts mentiong "mapo tofu" and like them.

```ts
import { AtpAgent } from '@atproto/api'
import { Trotsky } from './dist/trotsky.js'

async function main() {
  const agent = new AtpAgent({ service: 'https://bsky.social' })
  await agent.login({ identifier: 'trotsky.pirhoo.com', password: 'p4ssw0rd' })

  await Trotsky
    .init(agent)
    // The `streamPosts` uses Bluesky Firehose to get all 
    // posts in real-time. This feature is experimental 
    // and might use a lot of bandwith so use with caution!
    .streamPosts()
      .each()
        .when((step) => step?.context?.record?.text.includes('python'))
        .like()
        .run()
}

main()
```
