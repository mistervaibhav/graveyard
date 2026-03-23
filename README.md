# graveyard

Archive GitHub repos into this repo before deleting the originals.

Each buried repo is stored under `graves/`:

- `graves/<repo>`: working tree snapshot
- `graves/bundles/<repo>.bundle`: full git history bundle when the repo is non-empty

After a successful push, the local `graves/` working tree is cleared by default so it does not keep taking space on your machine.

## Requirements

- Go
- `git`
- `gh` logged into the account that owns the repos
- `gh` token with `delete_repo` scope
- `fzf` for the interactive picker

Refresh GitHub CLI scopes if needed:

```bash
gh auth refresh -h github.com -s delete_repo
```

## Run

From this repo:

```bash
go run . bury
```

The interactive picker uses:

- `Up` / `Down` to move
- `Space` to select or unselect
- `Enter` to confirm selection
- then a second confirmation prompt before burying

## Examples

Archive selected repos and delete them from GitHub:

```bash
go run . bury
```

Archive specific repos:

```bash
go run . bury repo-a repo-b
```

Archive everything:

```bash
go run . bury --all
```

Preview without changing anything:

```bash
go run . bury --dry-run
```

Archive but keep the original GitHub repos:

```bash
go run . bury repo-a --keep-remote
```

## Notes

- The default GitHub owner is `mistervaibhav`.
- The default clone host alias is `github.com-mistervaibhav`.
- Run this command from inside this repository.
- The command commits and pushes archive changes to this repo.

## Graves


| Repo | Epitaph | From | To | Buried |
| --- | --- | --- | --- | --- |
| `advent-of-code` | Winter puzzles, solved in time. | 2023-12-07 | 2023-12-07 | 2026-03-23 |
| `amazon-scrapper` | Crawled far. Rested early. | 2022-08-28 | 2022-08-28 | 2026-03-23 |
| `ani-cli` | Built, used, remembered. | 2021-06-09 | 2021-12-16 | 2026-03-23 |
| `BasicBrowser` | It opened windows to small worlds. | 2019-06-27 | 2019-06-27 | 2026-03-23 |
| `book-list` | It kept a decent shelf. | 2020-04-16 | 2020-04-21 | 2026-03-23 |
| `Carrot-Clicker` | Played hard. Retired quietly. | 2025-08-06 | 2025-08-06 | 2026-03-23 |
| `classic-tennis` | Played hard. Retired quietly. | 2021-01-01 | 2021-01-01 | 2026-03-23 |
| `codechef` | Built, used, remembered. | 2020-07-08 | 2020-08-22 | 2026-03-23 |
| `codeforces` | Built, used, remembered. | 2024-04-12 | 2024-04-12 | 2026-03-23 |
| `css-colors-to-js-object` | It named the shades well. | 2022-12-10 | 2022-12-10 | 2026-03-23 |
| `DeliveryDriver` | Built, used, remembered. | 2024-05-22 | 2024-06-28 | 2026-03-23 |
| `design-the-next-iphone` | Dreamed bigger than the hardware. | 2024-06-28 | 2024-06-28 | 2026-03-23 |
| `dictionary` | It knew the right words. | 2021-11-18 | 2021-11-18 | 2026-03-23 |
| `django-auth` | Served faithfully. Closed with order. | 2022-04-02 | 2022-04-02 | 2026-03-23 |
| `django-todo` | Served faithfully. Closed with order. | 2022-01-26 | 2022-01-26 | 2026-03-23 |
| `django-url-shortener` | Served faithfully. Closed with order. | 2022-01-16 | 2022-01-18 | 2026-03-23 |
| `eagrundy` | Built, used, remembered. | 2021-06-10 | 2021-06-14 | 2026-03-23 |
| `Euphony` | Built, used, remembered. | 2019-10-23 | 2019-11-07 | 2026-03-23 |
| `evolve-svgs` | Vectors bent, never broke. | 2024-04-02 | 2024-04-02 | 2026-03-23 |
| `flappy-bird` | Built, used, remembered. | 2021-11-15 | 2024-01-21 | 2026-03-23 |
| `fullstack-booktastic` | A whole stack, now at peace. | 2020-04-30 | 2020-04-30 | 2026-03-23 |
| `fullstack-ecommerce-app` | A whole stack, now at peace. | 2020-05-07 | 2020-08-08 | 2026-03-23 |
| `fullstack-medium-crawler` | Crawled far. Rested early. | 2020-07-22 | 2020-08-29 | 2026-03-23 |
| `imdb-scrapper` | Crawled far. Rested early. | 2022-08-26 | 2022-08-27 | 2026-03-23 |
| `implementation-of-promises` | A study in fundamentals. | 2022-05-10 | 2022-05-10 | 2026-03-23 |
| `implementation-of-redux` | A study in fundamentals. | 2021-07-11 | 2022-12-17 | 2026-03-23 |
| `kwazy.me` | Built, used, remembered. | 2024-03-11 | 2024-03-11 | 2026-03-23 |
| `Lox` | Built, used, remembered. | 2023-12-08 | 2024-04-04 | 2026-03-23 |
| `lyskraft-assignment` | Work completed. Deadline survived. | 2024-05-05 | 2024-05-13 | 2026-03-23 |
| `mine-sweeper` | Played hard. Retired quietly. | 2022-01-03 | 2022-01-03 | 2026-03-23 |
| `mouthpiece` | Built, used, remembered. | 2026-01-11 | 2026-01-12 | 2026-03-23 |
| `name-that-color` | It named the shades well. | 2024-06-28 | 2024-06-28 | 2026-03-23 |
| `nodechef` | Built on callbacks and caffeine. | 2021-07-30 | 2021-07-30 | 2026-03-23 |
| `nodejs-restful-api` | Built on callbacks and caffeine. | 2020-05-07 | 2020-05-07 | 2026-03-23 |
| `nodejs-sales-app` | Built on callbacks and caffeine. | 2020-05-03 | 2020-05-03 | 2026-03-23 |
| `nodejs-url-shortener` | Built on callbacks and caffeine. | 2020-07-03 | 2020-07-03 | 2026-03-23 |
| `quotes-backend` | It left a few good lines. | 2024-05-30 | 2024-05-30 | 2026-03-23 |
| `react-ecommerce-app` | Component by component, it lived. | 2020-05-19 | 2020-11-12 | 2026-03-23 |
| `react-github-api-client` | Component by component, it lived. | 2020-06-12 | 2020-07-23 | 2026-03-23 |
| `react-lyrics-search-app` | Component by component, it lived. | 2020-04-21 | 2020-04-23 | 2026-03-23 |
| `react-native-calculator` | Counted correctly. Asked no questions. | 2020-12-19 | 2020-12-19 | 2026-03-23 |
| `react-pokemon-app` | Component by component, it lived. | 2020-04-17 | 2020-04-17 | 2026-03-23 |
| `react-project-manager` | Organized until the very end. | 2020-07-14 | 2020-07-14 | 2026-03-23 |
| `react-random-advice-app` | Component by component, it lived. | 2020-05-03 | 2020-06-08 | 2026-03-23 |
| `react-redux-typescript-boilerplate` | Component by component, it lived. | 2018-09-16 | 2020-03-27 | 2026-03-23 |
| `react-task-management` | Organized until the very end. | 2020-05-18 | 2020-05-18 | 2026-03-23 |
| `rick-and-morty-wiki` | Fan service, lovingly rendered. | 2021-11-15 | 2022-10-02 | 2026-03-23 |
| `rock-paper-scissors` | Played hard. Retired quietly. | 2020-04-13 | 2020-04-17 | 2026-03-23 |
| `snake-game` | Played hard. Retired quietly. | 2020-06-03 | 2020-06-03 | 2026-03-23 |
| `space-invaders` | Played hard. Retired quietly. | 2020-08-06 | 2020-08-06 | 2026-03-23 |
| `SquareDash` | Built, used, remembered. | 2025-05-13 | 2025-05-13 | 2026-03-23 |
| `streamlit-stock-prices-app` | It watched the market flicker. | 2021-03-29 | 2021-03-29 | 2026-03-23 |
| `switch-the-gravity` | Played hard. Retired quietly. | 2022-10-16 | 2022-10-16 | 2026-03-23 |
| `TicTacToe` | Played hard. Retired quietly. | 2019-01-02 | 2019-05-23 | 2026-03-23 |
| `ToKarNaa` | Built, used, remembered. | 2021-06-27 | 2021-06-27 | 2026-03-23 |
| `transaction-wise` | Built, used, remembered. | 2024-12-01 | 2024-12-08 | 2026-03-23 |
| `twenty-forty-eight` | Played hard. Retired quietly. | 2026-01-13 | 2026-01-13 | 2026-03-23 |
| `twist-the-ball` | Played hard. Retired quietly. | 2021-11-04 | 2021-11-04 | 2026-03-23 |
| `word-count-cli` | Built, used, remembered. | empty | 2026-03-23 | 2026-03-23 |
