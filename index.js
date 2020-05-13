const fs = require('fs');
const { getInput } = require('@actions/core');
const generateReport = require('lib/generate-report');

const baseFilePath = getInput('base-report-path', { required: true });
const diffFilePath = getInput('comparison-report-path', { required: true });

const outputPath = getInput('output-path', { required: true });

const baseIdentifier = getInput('base-identifier', { required: false });
const diffIdentifier = getInput('comparison-identifier', { required: false });

const baseReport = JSON.parse(fs.readFileSync(baseFilePath));
const diffReport = JSON.parse(fs.readFileSync(diffFilePath));

const output = generateReport({
  baseReport,
  diffReport,
  baseIdentifier,
  diffIdentifier,
});

fs.writeFileSync(outputPath, output);
