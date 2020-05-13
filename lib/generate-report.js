module.exports = function({ baseReport, diffReport, baseIdentifier, diffIdentifier }) {
  return `
|               | ${baseIdentifier}      | ${diffIdentifier}      | change                                       |
|---------------|------------------------|------------------------|----------------------------------------------|
| passes        | ${baseReport.passes}   | ${diffReport.passes}   | ${diffReport.passes - baseReport.passes}     |
| failures      | ${baseReport.failures} | ${diffReport.failures} | ${diffReport.failures - baseReport.failures} |
| flaky         | ${baseReport.flaky}    | ${diffReport.flaky}    | ${diffReport.flaky - baseReport.flaky}       |
| duration (ms) | ${baseReport.duration} | ${diffReport.duration} | ${diffReport.duration - baseReport.duration} |
`;
}

