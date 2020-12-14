# Ember Test Audit comparison action

This is a GitHub Action that takes two Ember Test Audit [JSON reports](https://github.com/DingoEatingFuzz/ember-test-audit#json-output), calculates the differences, and generates a Markdown table showing them. This can then be [posted as a sticky comment](https://github.com/marocchino/sticky-pull-request-comment#read-comment-from-a-file) to a pull request.

If any flaky tests are detected, they are stored in another file that can be [optionally](https://github.com/andstor/file-existence-action) [posted as a comment](https://github.com/machine-learning-apps/pr-comment).

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
      - uses: backspace/ember-test-audit-comparison-action@v2
        with:
          base-report-path: base-audit.json
          comparison-report-path: pr-audit.json
          base-identifier: ${{ github.event.pull_request.base.ref }}
          comparison-identifier: ${{ github.event.pull_request.head.sha }}
          timing-output-path: audit-diff.md
          flakiness-output-path: flakiness-report.md
      - uses: marocchino/sticky-pull-request-comment@33a6cfb
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          path: audit-diff.md
      - uses: marocchino/sticky-pull-request-comment@v2.0.0
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          path: audit-diff.md
      - name: Check for existence of flakiness report
        id: check_file
        uses: andstor/file-existence-action@v1
        with:
          files: "flakiness-report.md"
      - name: comment PR
        if: steps.check_file.outputs.files_exists == 'true'
        uses: machine-learning-apps/pr-comment@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          path: flakiness-report.md
```

## Configuration

These are all required:

* `base-report-path`: the path to find the JSON report to compare against
* `comparison-report-path`: the path to find the JSON report to compare against the base
* `base-identifier`: the column header for the base
* `comparison-identifier`: the column header for the comparison
* `timing-output-path`: where to generate the timing Markdown comment
* `flakiness-output-path`: where to generate the flaky test Markdown comment

## Example output

> ## Ember Test Audit comparison
> |          | master      | 8938ec75aba9c47c9ecd4d504a9d8a1abd284768      | change                                       |
> |----------|------------------------|------------------------|----------------------------------------------|
> | passes   | 12   | 13   | +1     |
> | failures | 0 | 0 | 0 |
> | flaky    | 0    | 0    | 0       |
> | duration | 03s 138ms | 1m 44s 485ms | +1m 41s 347ms |

> ## Ember Test Audit flaky tests
>
> Ember Test Audit detected these flaky tests on 99653bb4d05e3f7bce09fee684437c3da97224ae:
>
> * Acceptance | job evaluations: it sometimes fails
