# invoices-web

Next.js frontend for a small invoicing app. It talks to `invoices-api` over REST.

## Run it

```sh
cp .env.example .env   # API_URL, defaults to http://localhost:3001
npm install
npm run dev            # http://localhost:3000
```

## Code review

Every pull request is reviewed by an agent running on [epho](https://epho.io). The workflow is `.github/workflows/epho-code-review.yml` and the reviewer's instructions are in `.github/epho-review/`. Changing how this repo gets reviewed is a pull request like any other.
