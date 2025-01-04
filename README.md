<p align="center">
  <img src="./docs/public/logo-hero.svg" width="150">
</p>

<h1 align="center">Trotsky</h1>

<p align="center">
<a href="https://trotsky.pirhoo.com">Documentation</a> |
<a href="https://trotsky.pirhoo.com/guide/why">Why Trotsky</a> |
<a href="https://trotsky.pirhoo.com/examples">Examples</a> |
<a href="https://trotsky.pirhoo.com/api">API</a>
</p>

A type-safe library to build automation at the top of ATProto/Bluesky API.

## Features

* **Builder Pattern**: Easily create our automation with an intuitive DSL.
* **Reduce Complexity**: Design advanced scenarios with a single expression in minutes.
* **Type-safety**: Benefit from type-safety and autocompletion for a robut development experience.
* **Discover**: Find inspirations with a curated list of Trotsky implementations.

## Quickstart

Install Trotsky from NPM with your favorite package manager:

```
yarn add trotsky
```

Then write your script using Trotsky:

```ts
import { AtpAgent } from "@atproto/api"
import { Trotsky } from "trotsky"

async function main() {
  const agent = new AtpAgent({ service: "https://bsky.social" })
  // Ensure you logged in with your agent, for instance using the login method
  await agent.login({ identifier: 'trotsky.pirhoo.com', password: 'h0rs3!' })

  await Trotsky
    .init(agent)
    .searchPost({ q: 'trotsky' })
      .take(5)
      .each()
        .like()
        .run()
}

main()
```

## Next Steps

Find out more about how to use Trotsky with advanced scenario on the official [documentation](https://trotsky.pirhoo.com).

