<p align="center">
  <img alt="Dutchie" src="https://image.flaticon.com/icons/svg/91/91540.svg" width="70">
</p>

<h3 align="center">
  Dutchie
</h3>

<p align="center">
  A shepherd for your commits and changelog
</p>

<p align="center">
  <img src="https://img.shields.io/github/release/justinsisley/dutchie.svg?style=for-the-badge" alt="GitHub release" /> <img src="https://img.shields.io/circleci/project/github/justinsisley/Dutchie.svg?style=for-the-badge" alt="CircleCI" /> <img src="https://img.shields.io/github/license/justinsisley/dutchie.svg?style=for-the-badge" alt="license" />
</p>

---

__Dutchie__ is a command line utility for [Node.js](https://nodejs.org/) that helps you maintain a simple, standardized format across all of your commit messages. The [standard](https://github.com/commitizen/conventional-commit-types/blob/master/index.json) is derived from the excellent [Commitizen](https://github.com/commitizen) project.

In addition to providing an easy-to-use CLI for making commits, __Dutchie__ also manages your `CHANGELOG.md` file, so you'll never have to worry about creating and maintaining detailed and accurate release notes again.

---

# Table of Contents

- [Features](#features)
- [Documentation](#documentation)
  - [Installation and Setup](#installation-and-setup)
  - [Making New Commits](#making-new-commits)
  - [Creating a New Release](#creating-a-new-release)
  - [Contributing](#contributing)
    - [Linting](#linting)
    - [Testing](#testing)
- [(in)Frequently Asked Questions](#faq)
- [Releases](https://github.com/justinsisley/dutchie/blob/master/CHANGELOG.md)
- [Credits](#credits)

# Features

- __Simple, consistent commit message formatting__ _(via [Commitizen](https://github.com/commitizen/conventional-commit-types/blob/master/index.json))_
- __One command updates your changelog and pushes a new Git tag for every release__
- __[Semantic Version](https://semver.org/) automatically determined based on commit types__
- __Quick and easy setup, with zero configuration__ _(via NPM scripts)_
- __Easy-to-use, guided command line interface__ _(via [Inquirer](https://www.npmjs.com/package/inquirer))_
- __Runs on Node.js v8+__

# Documentation

## Installation and Setup

Install as a _devDependency_:

```bash
npm install -D dutchie
```

Add the __commit__ and __release__ scripts to your `package.json` file:

```json
{
  "name": "my-project",
  "version": "0.0.1",
  "scripts": {
    "commit": "dutchie --commit",
    "release": "dutchie --release"
  },
}
```

## Making New Commits

When you're ready to commit your changes, your workflow will look something like this:

```bash
# Stage your changes
git add .
```

```bash
# Run Dutchie's guided commit CLI
npm run commit
```

```bash
# Push your changes
git push
```

> __Note:__ Dutchie doesn't make many assumptions about your Git workflow. Other than handling commit messages and managing your changelog, it tries its best to stay out of your way.

## Creating a New Release

There are only two requirements for creating a release:

1. Have one or more previous commits
2. Have no local changes

Once you're ready to create a release, run:

```bash
npm run release
```

If this is your first release, the `CHANGELOG.md` file will be created for you, and the version will be pulled from your `package.json` as is.

For subsequent releases, the version will be automatically bumped based on the types of commits since your last release. If any of the commits contain a feature, the release will be a minor bump (e.g. from 1.0.0 to 1.1.0), otherwise, it will be a patch (e.g. from 1.0.0 to 1.0.1).

To force a major release, use the `--major` argument:

```bash
npm run release -- --major
```

> __Note:__ The `release` command will automatically create or update your `CHANGELOG.md` file, update the version in your `package.json` file, create a new Git tag for the version, and push all of the changes upstream.

# Contributing

__Dutchie__ has a few core goals:

1. Help software teams maintain a detailed yet simple standard across all of their commit messages
2. Help software teams generate a detailed and accurate changelog and release tags for every new version

With these goals in mind, contributions are always welcome.

## Linting

Run ESLint with `npm run lint`.

## Testing

Run unit tests with `npm test`.

# FAQ

### What's with the name?

The [Dutch Shepherd](https://en.wikipedia.org/wiki/Dutch_Shepherd) is a relatively uncommon breed of dog that's hard-working, intelligent, and loyal. Often, they're referred to as "Dutchies".

This library aims to do the hard work of intelligently managing your commit messages and changelog without breaking a sweat or complaining. Like the canine, __Dutchie__ aims to be hard-working, intelligent, and loyal.

### Can't I just use Commitizen directly?

Absolutely. If Commitizen and its ecosystem of plugins work for you and your team, by all means, use them.

This library aims to strike a balance between simplicity and detail, and to increase the quality of commit messages and  changelogs by providing a straightforward CLI that developers can become familiar with very rapidly.

# Credits
<div>Icon made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>