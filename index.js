const fs = require('fs');
const { getInput } = require('@actions/core');

const baseFilePath = getInput('base-report-path', { required: true });
const diffFilePath = getInput('comparison-report-path', { required: true });

const outputPath = getInput('output-path', { required: true });

const baseIdentifier = getInput('base-identifier', { required: false });
const diffIdentifier = getInput('comparison-identifier', { required: false });

const baseReport = JSON.parse(fs.readFileSync(baseFilePath));
const diffReport = JSON.parse(fs.readFileSync(diffFilePath));

const baseCount = baseReport.passes + baseReport.failures + baseReport.flaky;
const diffCount = diffReport.passes + diffReport.failures + diffReport.flaky;

const countDiff = diffCount - baseCount;
const timeDiff = diffReport.duration - baseReport.duration;

console.log(`Change in number of tests run: ${countDiff}`);
console.log(`Change in total milliseconds for tests: ${timeDiff}`);

const output = `
|               | ${baseIdentifier}      | ${diffIdentifier}      | change                                       |
|---------------|------------------------|------------------------|----------------------------------------------|
| passes        | ${baseReport.passes}   | ${diffReport.passes}   | ${diffReport.passes - baseReport.passes}     |
| failures      | ${baseReport.failures} | ${diffReport.failures} | ${diffReport.failures - baseReport.failures} |
| flaky         | ${baseReport.flaky}    | ${diffReport.flaky}    | ${diffReport.flaky - baseReport.flaky}       |
| duration (ms) | ${baseReport.duration} | ${diffReport.duration} | ${diffReport.duration - baseReport.duration} |
`;

fs.writeFileSync(outputPath, output);
