const fs = require('fs');
const { getInput } = require('@actions/core');
const generateTimingReport = require('./lib/generate-timing-report');
const generateFlakinessReport = require('./lib/generate-flakiness-report');

const baseFilePath = getInput('base-report-path', { required: true });
const diffFilePath = getInput('comparison-report-path', { required: true });

const timingOutputPath = getInput('timing-output-path', { required: true });
const flakinessOutputPath = getInput('flakiness-output-path', {
  require: true,
});

const baseIdentifier = getInput('base-identifier', { required: false });
const diffIdentifier = getInput('comparison-identifier', { required: false });

const baseReport = JSON.parse(fs.readFileSync(baseFilePath));
const diffReport = JSON.parse(fs.readFileSync(diffFilePath));

const timingOutput = generateTimingReport({
  baseReport,
  diffReport,
  baseIdentifier,
  diffIdentifier,
});

fs.writeFileSync(timingOutputPath, timingOutput);

const flakinessOutput = generateFlakinessReport({
  baseReport,
  diffReport,
  baseIdentifier,
  diffIdentifier,
});

if (flakinessOutput.length) {
  fs.writeFileSync(flakinessOutputPath, flakinessOutput);
}
