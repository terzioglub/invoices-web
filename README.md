# invoices-web

> **This repo is part of an experiment.** It is the frontend for [invoices-api](https://github.com/terzioglub/invoices-api), where we tested whether an AI code reviewer catches more when it gets more context. The full write-up and results are in the [invoices-api README](https://github.com/terzioglub/invoices-api#readme).

## Its role in the experiment

Nobody opened PRs here. Instead, some reviewers of invoices-api got a copy of this repo, so they could check how an API change affects the frontend.

That access caught two breaks that the API code alone could not show:

- **`$NaN` everywhere.** An API PR renamed `amount` to `amount_cents`. This app still reads `invoice.amount`, so every amount would show as `$NaN`. Reviewers with this repo caught it 3 out of 3 times. Reviewers without it caught it 0 out of 3 times.
- **A crash on the new 409 error.** An API PR started returning 409 for duplicate emails. This app does not handle that error. Only the reviewer with team skills caught it (3 out of 3).

## Run it

```sh
cp .env.example .env   # API_URL, defaults to http://localhost:3001
npm install
npm run dev            # http://localhost:3000
```

## Status

The experiment is finished. This repo does not accept pull requests.
