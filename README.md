# Ember Test Audit comparison action

This is a GitHub Action that takes two Ember Test Audit [JSON reports](https://github.com/DingoEatingFuzz/ember-test-audit#json-output), calculates the differences, and generates a Markdown table showing them. This can then be [posted as a sticky comment](https://github.com/marocchino/sticky-pull-request-comment#read-comment-from-a-file) to a pull request.

## Usage

Here’s a simplified job workflow from a real-world use. It first generates audits for the base and PR branches in parallel and then runs the comparison.

```
jobs:
  time-base:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          ref: ${{ github.event.pull_request.base.sha }}
      - uses: nanasess/setup-chromedriver@master
      - uses: actions/setup-node@v1
        with:
          node-version: '10.x'
      - run: yarn --frozen-lockfile
      - run: npx ember-test-audit --json --output base-audit.json
      - name: Upload result
        uses: actions/upload-artifact@v2
        with:
          name: base-audit
          path: base-audit.json
  time-pr:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: nanasess/setup-chromedriver@master
      - uses: actions/setup-node@v1
        with:
          node-version: '10.x'
      - run: yarn --frozen-lockfile
      - run: npx ember-test-audit --json --output pr-audit.json
      - name: Upload result
        uses: actions/upload-artifact@v2
        with:
          name: pr-audit
          path: pr-audit.json
  compare:
    needs: [time-base, time-pr]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v2
        with:
          name: base-audit
      - uses: actions/download-artifact@v2
        with:
          name: pr-audit
      - uses: backspace/ember-test-audit-comparison-action@v1
        with:
          base-report-path: base-audit.json
          comparison-report-path: pr-audit.json
          base-identifier: ${{ github.event.pull_request.base.ref }}
          comparison-identifier: ${{ github.event.pull_request.head.sha }}
          output-path: audit-diff.md
      - uses: marocchino/sticky-pull-request-comment@33a6cfb
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          path: audit-diff.md
```

## Options

These are all required:

* `base-report-path`: the path to find the JSON report to compare against
* `comparison-report-path`: the path to find the JSON report to compare against the base
* `base-identifier`: the column header for the base
* `comparison-identifier`: the column header for the comparison
* `output-path`: where to generate the Markdown comment

## Example output

> ## Ember Test Audit comparison
> |          | master      | 8938ec75aba9c47c9ecd4d504a9d8a1abd284768      | change                                       |
> |----------|------------------------|------------------------|----------------------------------------------|
> | passes   | 12   | 13   | +1     |
> | failures | 0 | 0 | 0 |
> | flaky    | 0    | 0    | 0       |
> | duration | 03s 138ms | 1m 44s 485ms | +1m 41s 347ms |
