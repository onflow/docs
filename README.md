# Website

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

it pulls doc sections from repositories defined in https://github.com/onflow/developer-portal/tree/main/app/data/doc-collections

### Installation

```
$ yarn
```

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Deployment

Using SSH:

```
$ USE_SSH=true yarn deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.

### Search Indexing

- copy `.env Flow Docusaurus Prod`/`.env Flow Docusaurus Prod` to your local `.env` file from 1Password->`Flow Team` vault
