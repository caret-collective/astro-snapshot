<!-- Project Header -->
<div align="center">
<img class="projectLogo" src="docs/icon.svg" alt="Project logo" title="Project logo" width="256">
<h1 class="projectName">Astro Snapshot</h1>
<p class="projectBadges">
	<img src="https://johng.io/badges/category/Plugin.svg" alt="Project category" title="Project category">
	<img src="https://img.shields.io/github/languages/top/caret-collective/astro-snapshot.svg" alt="Language" title="Language">
	<img src="https://img.shields.io/github/repo-size/caret-collective/astro-snapshot.svg" alt="Repository size" title="Repository size">
	<a href="LICENSE"><img src="https://img.shields.io/github/license/caret-collective/astro-snapshot.svg" alt="Project license" title="Project license"/></a>
	<a href="https://github.com/semantic-release/semantic-release"><img src="https://img.shields.io/badge/semantic--release-conventionalcommits-e10079?logo=semantic-release" alt="Semantic Release" title="Semantic Release"/></a>
</p>
<p class="projectBadges status">
	<a href="https://github.com/caret-collective/astro-snapshot/releases/latest"><img src="https://img.shields.io/github/v/release/caret-collective/astro-snapshot.svg" alt="Latest release" title="Latest release"/></a>
	<a href="https://jsr.io/@twocaretcat/astro-snapshot"><img src="https://jsr.io/badges/@twocaretcat/astro-snapshot" alt="View package on JSR" title="View package on JSR" /></a>
	<a href="https://jsr.io/@twocaretcat/astro-snapshot"><img src="https://jsr.io/badges/@twocaretcat/astro-snapshot/score" alt="View package on JSR" title="View package on JSR" /></a>
	<a href="https://www.npmjs.com/package/@twocaretcat/astro-snapshot"><img src="https://img.shields.io/npm/v/@twocaretcat/astro-snapshot" alt="View package on npmjs" title="View package on npmjs"/></a>
</p>
<p class="projectDesc">
	An Astro integration for generating screenshots of your pages automatically at build time
</p>
<br/>
</div>

## 👋 About

Generate screenshots of your [Astro] pages automatically at build time with **Astro Snapshot**. Perfect for creating
social images, content previews, dynamic icons, and more!

This integration was inspired by [astro-selfie] and a similar plugin I wrote for [Gatsby] called
[Gatsby Plugin: Component to Image]. Compared to astro-selfie, this integration exposes a lot more configuration options
which allow you to completely customize how images are generated.

### Features

- **🧩 Framework agnostic**: Generate images from any valid Astro page or external site
  - Unlike other integrations for generating social images, not limited to preset layouts
  - Unlike [Satori], not limited to certain types of JSX elements or CSS properties
  - Use whatever front-end framework you want
  - Capture third-party sites by specifying a URL instead of a path
- **📸 Customizable outputs**: Full control over the generated images
  - Generate multiple images per page with different configurations
  - Save images to `public`, `dist`, `src`, or any other directory
  - Save PNG, JPEG, or WebP images, with the format automatically detected from the output filename
  - Save images at any resolution
  - Choose whether to overwrite existing images or skip them
- ⚙️ **Flexible configuration**: Advanced options for power users
  - Define global defaults to keep configs minimal and override them on a per-image basis
  - Pass through options directly to [Puppeteer] for precise control of the browser, viewport, and screenshot generation
    process
- 🔧 **TypeScript support**: Full type safety for all options and functions
  - Import types from the package to make sure your config is correct
  - Install the package from JSR for use with TypeScript-native runtimes like Deno

### Use Cases

- **🏞️ Social images**: Use your existing front-end components to generate [Open Graph] images and/or Twitter cards for
  your blog posts or other content
- **📰 Content previews**: Generate screenshots of your website for use in documentation, marketing materials,
  showcases, etc.
- **🖼️ Favicons**: Dynamically generate favicons for your website

## 🚀 Getting Started

For installation and usage instructions, see the [docs](https://astro-snapshot.johng.io).

## 🛟 Support

Need help? Refer to the [troubleshooting](https://astro-snapshot.johng.io/guide/troubleshooting/) page in the docs for a
list of common issues and their solutions, or see the
[support resources](https://github.com/caret-collective/.github/blob/main/docs/SUPPORT.md) for information on how to:

- request features
- report bugs
- ask questions
- report security vulnerabilities

## 🤝 Contributing

Want to help out? Pull requests are welcome for:

- feature implementations
- bug fixes
- documentation
- tests

See the [contribution guide](../../contribute) for more details.

## 🧾 License

Copyright © 2026 [John Goodliff](https://johng.io/r/astro-snapshot) ([@twocaretcat](https://github.com/twocaretcat)).

This project is licensed under the MIT license. See the [license](LICENSE) for more details.

We are not affiliated with or endorsed by [Astro].

## 🖇️ Related

See the [related projects](https://astro-snapshot.johng.io/resources/related/) page in the docs for a list of similar
projects you might like.

## 💕 Funding

Find this project useful? [Sponsoring me](https://johng.io/funding) will help me cover costs and **_commit_** more time
to open-source.

If you can't donate but still want to contribute, don't worry. There are many other ways to help out, like:

- 📢 reporting (submitting feature requests & bug reports)
- 👨‍💻 coding (implementing features & fixing bugs)
- 📝 writing (documenting & translating)
- 💬 spreading the word
- ⭐ starring the project

Thanks for the support!

[Astro]: https://astro.build/
[Gatsby]: https://www.gatsbyjs.com/
[astro-selfie]: https://github.com/vadimdemedes/astro-selfie
[Open Graph]: https://ogp.me/
[Satori]: https://github.com/vercel/satori
[Puppeteer]: https://pptr.dev/
[Gatsby Plugin: Component to Image]: https://github.com/caret-collective/gatsby-plugin-component-to-image
