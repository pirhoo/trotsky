---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: Trotsky
  text: Automate your Bluesky agents.
  tagline: Trotsky is a type-safe library to build automation at the top of ATProto/Bluesky API.
  image:
    src: /logo-hero.svg
    alt: Trotsky
  actions:
    - theme: brand
      text: Get Started
      link: /guide/
    - theme: alt
      text: API
      link: /api/

features:
  - title: Builder Pattern
    icon: 🏗️
    details: Easily create your automation with an intuitive DSL.
  - title: Reduce Complexity
    icon: 📦
    details: Design advanced scenarios with a single expression in minutes.
  - title: Type-safety
    icon: 🧘‍♀️
    details: Benefit from type-safety and autocompletion for a robust development experience.
  - title: Discover
    icon: 🪩
    details: Find inspirations with a curated list of Trotsky implementations.
---


<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #b92e2e 30%, #db7575);

  --vp-home-hero-image-background-image: linear-gradient(-45deg,rgb(185, 46, 46, 0.5) 50%,rgba(219, 117, 117, 0.5) 50%);
  --vp-home-hero-image-filter: blur(44px);
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px);
  }
}
</style>