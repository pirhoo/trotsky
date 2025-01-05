# Getting started

## Installation

- [Node.js](https://nodejs.org/) version 20 or higher.
- Terminal for executing your Trotsky script via its command line interface (CLI).

Trotsky must be installed with your favorite package manager:

::: code-group

```sh [npm]
$ npm add trotsky
```

```sh [pnpm]
$ pnpm add trotsky
```

```sh [yarn]
$ yarn add trotsky
```


```sh [bun]
$ bun add trotsky
```

:::

## Your first automation

This simple Trotsky implementation will:

1. **Import** the required classes from Trotsky.
2. **Create** an `AtpAgent` instance (from the `@atproto/api` package).
3. **Initialize** Trotsky with your agent and describe the scenario.
4. **Run** your Trotsky instance.


::: code-group

```ts [Module]
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

```ts [CommonJS]
const { AtpAgent } = require("@atproto/api")
const { Trotsky } = require("trotsky")

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

:::