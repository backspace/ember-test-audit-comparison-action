module.exports = function({ baseReport, diffReport, baseIdentifier, diffIdentifier }) {
  return `
|               | ${baseIdentifier}      | ${diffIdentifier}      | change                                       |
|---------------|------------------------|------------------------|----------------------------------------------|
| passes        | ${baseReport.passes}   | ${diffReport.passes}   | ${formatChangeInteger(diffReport.passes - baseReport.passes)}     |
| failures      | ${baseReport.failures} | ${diffReport.failures} | ${formatChangeInteger(diffReport.failures - baseReport.failures)} |
| flaky         | ${baseReport.flaky}    | ${diffReport.flaky}    | ${formatChangeInteger(diffReport.flaky - baseReport.flaky)}       |
| duration (ms) | ${baseReport.duration} | ${diffReport.duration} | ${formatChangeInteger(diffReport.duration - baseReport.duration)} |
`;
}

function formatChangeInteger(integer) {
  return integer > 0 ? `+${integer}` : integer;
}