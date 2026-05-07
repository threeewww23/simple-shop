# Telegram Mini App client

This project contains an example of Telegram Mini App.

Telebook — is a fictional hotel booking service integrated to Telegram. It uses completely mocked data of hotels, cities and pictures.

<p align="center">
  <a href="https://t.me/tebook_bot/telebook">
    <picture>
      <source media="(prefers-color-scheme: dark)"  srcset="../docs/assets/cover.png">
      <source media="(prefers-color-scheme: light)" srcset="../docs/assets/cover-light.png">
      <img alt="Editor.js Logo" src="../docs/assets/cover.png">
    </picture>
  </a>
</p>

## Features and Stack

- 📦 Vue Telegram UI Kit
- 📲 Declarative screens construction
- ✈️ `useTelegram()` composable that simplifies usage of Telegram Web App SDK
- ❤️‍🔥 Instant picture previews and on-device cache
- 💎 Clean but simple architecture
- ✨ Hot Reloading
- 💬 Checkout redirect to manager chat via Telegram Web App SDK

## Telegram Vue UI Kit

It contains ready-to-use collection of components that could be used to create native-like views that will look perfect on iOS, Android and other devices

- [Amount](./src/presentation/components/README.md#amount)
- [Avatar](./src/presentation/components/README.md#avatar)
- [DataOverview](./src/presentation/components/README.md#dataoverview)
- [DatePicker](./src/presentation/components/README.md#datepicker)
- [DatePickerCompact ](./src/presentation/components/README.md#datepickercompact)
- [Icon](./src/presentation/components/README.md#icon)
- [Input](./src/presentation/components/README.md#input)
- [List](./src/presentation/components/README.md#list)
- [ListItem](./src/presentation/components/README.md#listitem)
- [ListCard](./src/presentation/components/README.md#listcard)
- [ListItemExpandable](./src/presentation/components/README.md#listitemexpandable)
- [Lottie](./src/presentation/components/README.md#lottie)
- [FixedFooter](./src/presentation/components/README.md#fixedfooter)
- [PageWithHeader](./src/presentation/components/README.md#pagewithheader)
- [Placeholder](./src/presentation/components/README.md#placeholder)
- [Rating](./src/presentation/components/README.md#rating)
- [Section](./src/presentation/components/README.md#section)
- [Sections](./src/presentation/components/README.md#sections)
- [Text](./src/presentation/components/README.md#text)

Read more in [Telegram Vue UI Kit](./src/presentation/components/README.md) documentation

## Get started

0. Crate a bot

Go to [@BotFather](https://t.me/@BotFather), write the `/newbot` command and follow instructions.

Then, call the `/newapp` comman to create your app. When BotFather will ask about Web App Url, start running the application as described below.

1. Install dependencies

```
yarn install
```

2. Copy .env.example to .env and fill the variables

```
cp .env.example .env
```

| Name | Description | Example | Where to get |
| -- | -- | -- | -- |
| VITE_WEB_HOST | Web client endpoint | `https://xxxx-xx-xxx-xxx-xx.ngrok-free.app` | Use ngrok host for local development and your production host on real environment |
| VITE_MANAGER_USERNAME | Telegram manager username (without `@`) | `your_manager_username_here` | Telegram username of the shop manager who should receive order text |

3. Run

| Command | Description |
| -- | -- |
| `yarn dev` | Start dev server with Hot Reloading |
| `yarn build` | Compile TS and prepare bundle for production |
| `yarn preview` | Preview production bundle |
| `yarn link` | Check ESLint problems |
| `yarn link:fox` | Autofix ESLint problems when possible |

4. When app is running, give a link to @BotFather:

Copy the URL of your running app and send it to [@BotFather](https://t.me/@BotFather) if he still waiting for it during app creation process. Or call `/myapps`, select our bot and press `Edit Web App URL` button on the Inline Keyboard.

### Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).


## Tech Stack and credits

List of libraries the project relies on

- TypeScript
- [Vue.js 3](https://vuejs.org) — reactive UI framework
- [Vite](https://vitejs.dev) — build system
- [@twa-dev/sdk](https://github.com/twa-dev/SDK) — Telegram Web App SDK wrapper and Type Definitions
- [@vueuse/core](https://vueuse.org) — Collection of Essential Vue Composition Utilities
- [normalize.css](https://necolas.github.io/normalize.css/) — makes browsers render all elements more consistently
- [Vue Router](https://router.vuejs.org) — helps handling of navigation
- [vue3-lottie](https://vue3-lottie.vercel.app) — Lottie animations player

## Directory structure

The directory structure introduces the simple variation of [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html).
We separate the application into layers, where each layer has its own responsibility. The layers are:

- `/presentation` - responsible for the UI. Contains all the UI components, screens, and assets
- `/application` - responsible for the presentation-related business logic. It contains the application services, which are actually Vue Composables.
- `/domain` - responsible for the domain logic. It contains the entities and business rules (domain services)
- `/infra` - responsible for transport, store, and utils

```
client
├── application
│   ├── services
│   │   ├── ...
│   │   └── vue composables used by presentation layer
│   └── router.ts - vue-router instance
├── domain
│   ├── entities
│   │   ├── ...
│   │   └── domain entities (things from the real world)
│   └── services
│       ├── ...
│       └── domain services (business rules)
├── infra
│   ├── store
│   │   ├── ...
│   │   └── storages used by domain layer
│   ├── transport
│   │   ├── ...
│   │   └── transport layer (telebook api, etc)
│   └── utils
│       ├── ...
│       └── utils used by any layer
└── presentation
    ├── assets
    │   ├── ...
    │   └── icons, fonts, lottie, etc
    ├── components
    │   ├── ...
    │   └── Telegram Vue UI Kit
    ├── screens
    │   ├── ...
    │   └── application screens (pages) used by router
    └── styles
        ├── ...
        └── styles used by presentation layer
```
