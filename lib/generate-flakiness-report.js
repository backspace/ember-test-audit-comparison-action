module.exports = function({ baseReport, diffReport, baseIdentifier, diffIdentifier }) {
    const baseFlakyTestNames = baseReport.flakyTestNames;
    const diffFlakyTestNames = diffReport.flakyTestNames;

    if (baseFlakyTestNames.length || diffFlakyTestNames.length) {
        return `## Ember Test Audit flaky tests${generateReportForIdentifier(baseFlakyTestNames, baseIdentifier)}${generateReportForIdentifier(diffFlakyTestNames, diffIdentifier)}
`;
    } else {
        return '';
    }
}

function generateReportForIdentifier(testNames, identifier) {
    if (testNames.length) {
        return `

Ember Test Audit detected these flaky tests on ${identifier}:

${testNames.map(name => `* ${name}`).join('\n')}`;
    } else {
        return '';
    }
}