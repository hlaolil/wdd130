# Letlotlo Hlaoli — personal website

My personal website. It started as my WDD 130 (Web Fundamentals) home page at BYU–Pathway and now also hosts my research tools, membership forms and the coursework from my web development studies.

**Live site:** https://hlaolil.github.io/wdd130/

## What's here

| Path | What it is |
| --- | --- |
| `index.html`, `styles/site.css` | The personal site: about, what I do, projects, membership forms, education and contact |
| `theologyhub/` | Built copy of **TheologyHub**, which searches theology books, articles and dissertations and holds my bivocational-ministry reading list ([source](https://github.com/hlaolil/wdd330-project)) |
| `books/` | Built copy of **BookHub**, my Zotero library as a bookshelf, filtered by folder, subject and reading status ([source](https://github.com/hlaolil/wdd-project2)) |
| `members/` | Membership forms for **AGL BB** and **LDMCF** (Letšeng Diamonds Mine Christian Fellowship). Entries are posted to a Google Apps Script web app that saves each one as a row in a Google Sheet |
| `tools/` | Pages I run myself (not linked from the site) to import the reading lists into Zotero and add summaries and covers |
| `wwr/` | WDD 130 course project: a white-water rafting company website (home, about, trips, contact, site plan) |
| `wdd130-home.html` | My original WDD 130 home page |
| `week02/`, `week05/`, `quiz.html` | WDD 130 weekly exercises: a holy-grail layout, a poll form and a quiz form |

## Run it locally

It is a static site with no build step:

```bash
python3 -m http.server 8000
# then open http://localhost:8000/
```

`theologyhub/` and `books/` are build output. To change them, edit the source repositories, run `npm run build`, and copy the `dist/` folder here.

## Deployment

GitHub Pages publishes the `main` branch, so every push to `main` goes live within a minute or two.
