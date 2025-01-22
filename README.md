<h1 align="center">Trotsky</h1>
<p align="center">
  <a href="https://trotsky.pirhoo.com"  align="center">
    <img src="./docs/public/logo-square-light.svg" width="150">
  </a>
</p>
<p align="center"><strong>A type-safe library to build automation at the top of ATProto/Bluesky API.<strong></p>

<div align="center">

|      | Status |
| ---: | :--- |
| **CI checks** | [![Github Actions](https://img.shields.io/github/actions/workflow/status/pirhoo/trotsky/main.yml?style=flat-square)](https://github.com/pirhoo/trotsky/actions/workflows/main.yml) |
| **Latest version** | [![Latest version](https://img.shields.io/npm/v/trotsky?style=flat-square&color=success)](https://www.npmjs.com/package/trotsky) |
|   **Release date** | [![Release date](https://img.shields.io/npm/last-update/trotsky?style=flat-square&color=success)](https://github.com/pirhoo/trotsky/releases/latest) |
|   **Code Climate** | [![Maintainability](https://img.shields.io/codeclimate/maintainability/pirhoo/trotsky?style=flat-square)](https://codeclimate.com/github/pirhoo/trotsky) |
|    **Open issues** | [![Open issues](https://img.shields.io/github/issues/pirhoo/trotsky?style=flat-square&color=success)](https://github.com/ICIJ/datashare/issues/) |
|  **Documentation** | [![Guide](https://img.shields.io/badge/Guide-b92e2e?style=flat-square)](https://trotsky.pirhoo.com/guide/getting-started.html) [![API](https://img.shields.io/badge/API-b92e2e?style=flat-square)](https://trotsky.pirhoo.com/api/reference/) |

</div>

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

