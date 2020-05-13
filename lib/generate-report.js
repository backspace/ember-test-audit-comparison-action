module.exports = function({ baseReport, diffReport, baseIdentifier, diffIdentifier }) {
  const durationDiff = diffReport.duration - baseReport.duration;

  return `
|          | ${baseIdentifier}      | ${diffIdentifier}      | change                                       |
|----------|------------------------|------------------------|----------------------------------------------|
| passes   | ${baseReport.passes}   | ${diffReport.passes}   | ${formatChangeInteger(diffReport.passes - baseReport.passes)}     |
| failures | ${baseReport.failures} | ${diffReport.failures} | ${formatChangeInteger(diffReport.failures - baseReport.failures)} |
| flaky    | ${baseReport.flaky}    | ${diffReport.flaky}    | ${formatChangeInteger(diffReport.flaky - baseReport.flaky)}       |
| duration | ${humanDuration(baseReport.duration)} | ${humanDuration(diffReport.duration)} | ${durationDiff > 0 ? '+' : durationDiff}${humanDuration(durationDiff)} |
`;
}

function formatChangeInteger(integer) {
  return integer > 0 ? `+${integer}` : integer;
}

// This is copied from https://github.com/DingoEatingFuzz/ember-test-audit/blob/5a46192e280c806db111623ec84d4e8e13b792aa/index.js#L299-L310
function humanDuration(duration) {
  const ms = duration % 1000;
  const s = Math.floor((duration / 1000) % 60);
  const m = Math.floor(duration / 1000 / 60);

  const fs = s < 10 ? `0${s}` : `${s}`;
  const fms = ms < 10 ? `00${ms}` : ms < 100 ? `0${ms}` : `${ms}`;

  if (m) return `${m}m ${fs}s ${fms}ms`;
  else if (s) return `${fs}s ${fms}ms`;
  return `${fms}ms`;
}
  