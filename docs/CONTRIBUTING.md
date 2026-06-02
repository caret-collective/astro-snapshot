# 🤝 Contributing

Thanks for your interest in contributing to **astro-snapshot**! This document provides guidelines and instructions for
contributing to the project.

## Reporting Issues

You can [create an issue](https://github.com/caret-collective/astro-snapshot/issues) to request a new feature or report a
problem with the project. Make sure a similar issue doesn't already exist.

### Feature Requests

For feature requests, please describe:

- The problem you're trying to solve
- Your proposed solution
- Any alternative solutions you've considered
- Examples of how the feature would be used

### Bug Reports

When reporting bugs, please include:

- A clear description of the issue
- Steps to reproduce
- Expected behavior vs actual behavior
- Your JS runtime and version (ex. Node 24.1.1)
- Code samples or test cases demonstrating the issue

### Questions

If you have a question about the project, please start a [discussion].

### Security Vulnerabilities

See the [security policy](SECURITY.md) for details on reporting security vulnerabilities.

### Pull Requests

Issues with the `🚦 ready` label are ready to be worked on. If you comment on an issue, I can assign it to you.

Issues with the `🚦 needs triage` label generally need some more information before they can be worked on, but if you
start a [discussion] about it or leave a comment on the issue, I can likely get it ready for you.

If an issue is unclear or you have any questions about how a feature should be implemented, reach out before making any
changes so we can discuss the best way to do it.

## Project Structure

This repository is a **monorepo** (i.e. a single repository that contains multiple related projects). We use
[Deno workspaces](https://docs.deno.com/runtime/fundamentals/workspaces/) to manage it, which means a single
`deno install` at the root installs dependencies for all projects at once, and tools like `deno fmt` and `deno lint`
apply consistently across the entire codebase.

There are three workspace members:

- **`packages/astro-snapshot`:** the `@twocaretcat/astro-snapshot` library itself
- **`tests/fixture`:** a minimal Astro site used as an integration test fixture
- **`docs/site`:** the documentation site built with [Starlight]

Most `deno` commands can be run from the repo root to apply across all members, or from within a specific member's
directory if you're only working on that part of the project. The exceptions are tasks defined in a member's own
`deno.json` (like `build:npm`), which must be run from that member's directory.

```txt
astro-snapshot/
│
├── 📂 .github/
│   └── 📂 workflows/
│       ├── 📄 docs.yml               # Deploy docs site to GitHub Pages
│       ├── 📄 publish.yml            # Build & publish to JSR and npm
│       └── 📄 test.yml               # Run integration tests
│
├── 📂 docs/
│   ├── 📂 site/                      # Docs site (workspace member)
│   │   ├── 📂 src/
│   │   ├── 📄 astro.config.ts
│   │   └── 📄 deno.json              # Docs site dependencies
│   ├── 📄 CONTRIBUTING.md
│   ├── 📄 SECURITY.md
│   └── 📄 icon.svg
│
├── 📂 packages/
│   └── 📂 astro-snapshot/            # The @twocaretcat/astro-snapshot library (workspace member)
│       ├── 📂 npm/                   # Build output for npm (auto-generated, not committed)
│       ├── 📂 scripts/
│       │   ├── 📄 build-npm.ts       # Builds the npm package using dnt
│       │   └── 📄 update-version.ts  # Updates the version in deno.json
│       ├── 📂 src/
│       │   ├── 📄 index.ts           # Main module and public API
│       │   ├── 📄 types.ts           # Exported types
│       │   └── 📄 utils.ts           # Internal utilities
│       ├── 📄 deno.json              # Package name, version, exports, tasks, and dependencies
│       ├── 📄 package.json           # npm peer dependencies
│       ├── 📄 release.config.js      # Semantic Release configuration
│       └── 📄 tsconfig.json          # TypeScript config for TypeDoc (API reference generation)
│
├── 📂 tests/
│   ├── 📂 fixture/                   # Minimal Astro site used as a test fixture (workspace member)
│   │   ├── 📂 src/
│   │   └── 📄 deno.json
│   ├── 📂 test-cases/
│   │   ├── 📂 shared/                # Test case definitions for the shared build
│   │   └── 📂 isolated/              # Test case definitions for isolated builds
│   ├── 📂 utils/                     # Assertion classes, build helpers, text utilities
│   ├── 📄 constants.ts
│   ├── 📄 types.ts
│   ├── 📄 shared.test.ts             # Test runner for the shared build
│   └── 📄 isolated.test.ts           # Test runner for isolated builds
│
├── 📄 deno.json                      # Workspace root: shared config, formatter, linter, shared deps
├── 📄 deno.lock
├── 📄 package.json                   # npm overrides for release tooling
└── 📄 README.md
```

## Development Workflow

### Prerequisites

- [Deno](https://deno.land/)
- [Git](https://git-scm.com/) for version control
- A code editor ([VS Codium](https://vscodium.com/) with the
  [Deno extension](https://open-vsx.org/extension/denoland/vscode-deno) is recommended)

### Getting Started

Here's a quick example of how to contribute a new feature or bug fix:

1. Fork and clone the repository:

   ```bash
   git clone https://github.com/YOUR_USERNAME/astro-snapshot.git
   cd astro-snapshot
   ```

2. Install dependencies:

   ```bash
   deno install
   ```

3. Create a new branch:

   ```bash
   git checkout -b feat/your-feature-name
   ```

4. Make your changes
5. Write or update docs/tests as needed
6. Run the full check suite:

   ```bash
   deno check
   deno lint
   deno fmt
   deno task test
   ```

7. Commit your changes:

   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

8. Push and create a pull request:

   ```bash
   git push origin feat/your-feature-name
   ```

## Checking

We use Deno's built-in tools for checking code quality. Make sure to run these before submitting a pull request. All
commands can be run from the repo root to check the entire codebase, or from within a workspace member's directory to
check only that project.

### Checking TypeScript Types

```bash
deno check
```

### Formatting Code

```bash
deno fmt          # Format all files
deno fmt --check  # Check formatting without modifying files
```

### Linting Code

```bash
deno lint
```

## Testing

We use Deno's built-in test runner for integration tests. The tests live in the [tests/](../tests/) directory and work
by building the fixture project (a minimal Astro site at `tests/fixture/`) with the integration under test, then
asserting on the generated screenshots using [Sharp](https://sharp.pixelplumbing.com/).

We use two files to run tests based on the setup they require:

- **[shared.test.ts](../tests/shared.test.ts)**: Runs all test cases that can be verified in a single Astro build. These
  test cases live in [tests/test-cases/shared/](../tests//test-cases/shared/).
- **[isolated.test.ts](../tests/isolated.test.ts)**: Runs test cases that require their own build, either because they
  need specific integration-level config (such as `defaults.overwrite`) or controlled filesystem state. Each test case
  runs as its own build. These test cases live in [tests/test-cases/isolated/](../tests//test-cases/isolated/).

The [tests/fixture/astro.config.ts](../tests/fixture/astro.config.ts) file automatically loads the appropriate test case
for the respective build based on the `SCENARIO` environment variable that is set by the test runner.

> [!IMPORTANT]
> These tasks should be run from the project root.

### Running Integration Tests

```bash
deno task test
```

## Documentation

> [!IMPORTANT]
> These tasks are only available in the `docs/site/` workspace member. Run them from that directory.

The documentation site is built with [Starlight] and lives in the [docs/site/](./site/) directory. It is deployed
automatically to GitHub Pages on every push to `main`.

### Running the Dev Server

```bash
deno task dev
```

### Building for Production

```bash
deno task build
```

### Serving

```bash
deno task serve
```

## Building

We use a custom script to produce a Node.js-compatible npm package using [dnt] (Deno to Node Transform). No build step
is required for JSR.

### Building for npm

> [!IMPORTANT]
> This task is only available in the `packages/astro-snapshot/` workspace member. Run it from that directory.

```bash
deno task build:npm        # Build with version from deno.json
deno task build:npm 0.2.0  # Build with a specific version
```

The output is written to the `npm/` directory within the package, which is excluded from version control and from JSR
publishing.

## Publishing

The package is published to JSR as [@twocaretcat/astro-snapshot](https://jsr.io/@twocaretcat/astro-snapshot) and to npm
as [@twocaretcat/astro-snapshot](https://www.npmjs.com/package/@twocaretcat/astro-snapshot).

Publishing is automated with [Semantic Release](https://semantic-release.gitbook.io/semantic-release) using the
[publish workflow](../.github/workflows/publish.yml). Semantic Release is configured in
[release.config.js](../packages/astro-snapshot/release.config.js) and runs from within the `packages/astro-snapshot`
workspace member.

### Workflow

1. Pushes to the `main` branch will trigger the workflow, where we run Semantic Release
2. Commits will trigger new releases based on their type. We use the
   [conventionalcommits](https://www.conventionalcommits.org/en/v1.0.0/) preset. For example:

   - `feat!:` - Major version bump
   - `feat:` - Minor version bump
   - `fix:` - Patch version bump
   - `docs:` - No version bump

3. If a commit triggers a release, we will:
   1. Update the version in [deno.json] using `deno task version <version>`, push the changes, and create a new tag
   2. Build the package for npm using `deno task build:npm`
   3. Publish the package to npm with `npm publish`
   4. Publish the package to JSR with `deno publish`
   5. Create a GitHub release with the release notes

### Updating the Version

> [!IMPORTANT]
> You don't need to run this task manually. It is run automatically by the publish workflow to bump the version number
> before publishing. It is only available in the `packages/astro-snapshot/` workspace member.

```bash
deno task version 1.0.0
```

## Code Style Guidelines

See the existing source for examples of how to write code that fits with the project's style.

### TypeScript Best Practices

- Use explicit type annotations for function parameters and return types
- Avoid `any` type unless absolutely necessary

### Formatting

- Use `deno fmt` or the Deno extension in your code editor and you should be good
- Compared to the defaults, this project uses tabs, single quotes, and a larger line width of 120 characters

### Documentation

- Add TSDoc comments for all exported functions and types
- Keep comments up-to-date with code changes
- If necessary, update the [README](../README.md), docs site, and any other applicable files in the [docs/](./)
  directory

### Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Test additions or modifications
- `chore:` - Maintenance tasks

If you are making a breaking change, add an exclamation mark after the type and a `BREAKING CHANGE:` footer further
explaining the breaking changes for users. For example:

<!-- Example from https://www.conventionalcommits.org/en/v1.0.0/ | MIT -->

```txt
feat: allow provided config object to extend other configs

BREAKING CHANGE: `extends` key in config file is now used for extending other config files
```

## License

By contributing to this project, you agree that your contributions will be licensed under the project
[license](../LICENSE).

[dnt]: https://github.com/denoland/dnt
[discussion]: https://github.com/caret-collective/astro-snapshot/discussions
[deno.json]: ../packages/astro-snapshot/deno.json
[Starlight]: https://starlight.astro.build/
