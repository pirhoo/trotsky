# Frequently Asked Questions (FAQ)

## Is Trotsky affiliated with Bluesky?

No, Trotsky is not affiliated with Bluesky. It is an independent project designed to interact with APIs like Bluesky’s in a structured and modular way.

## What does the name "Trotsky" mean?

The name "Trotsky" is a reference to the historical figure Leon Trotsky. It reflects the idea of orchestrating structured steps, much like organizing revolutionary actions.

## What are the limitations of Trotsky?

Trotsky relies on the APIs it interacts with, and therefore it is subject to their limitations, such as:

* API [rate limits](https://docs.bsky.app/docs/advanced-guides/rate-limits).
* Availability of features and data from the API.

## Is it dangerous to use Trotsky?

No, using Trotsky is not dangerous. However, certain operations, like [`streamPosts`](/api/trotsky.trotsky.streamposts), can consume significant bandwidth, especially when utilizing the **Bluesky Firehose**. To limit bandwidth usage, Trotsky is already configured to use compressed stream with `zstd` through [Jetstream](https://github.com/bluesky-social/jetstream).

## What's the Bluesky Firehose?

The Bluesky Firehose is a core component of the AT Protocol that delivers an authenticated, real-time stream of all events occurring on the network. This includes user activities such as posts, likes, follows, and handle changes. It is designed to efficiently synchronize user updates and is commonly used by applications like feed generators, labelers, bots, and search engines to access a unified stream of data from the network.  

## Can my account be blocked?

To avoid your account being blocked, follow these guidelines:

* Adhere to the Trotsky's [code of conduct](/guide/code-of-conduct).
* Indicate in your profile if your account is a bot.
* Never engage first to avoid spamming other users.

## Who are we?

Trotsky was developed me, Pierre Romera Zhang, a fullstack developer. My initial motivation to create Trotsky was to have a project to learn Typescript and play with the ATProto API.

## Can we contribute?

Yes! Contributions are welcome. You can:

- Submit [bug reports](https://github.com/pirhoo/trotsky/issues) or feature requests.
- Fork the [repository](https://github.com/pirhoo/trotsky) and submit pull requests.
- Help use to improve the documentation.

