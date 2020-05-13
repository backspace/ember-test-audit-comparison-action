import { expect } from 'chai';
const generateReport = require('../lib/generate-report');

describe('Generate report', function () {
  it('should calculate changes', function () {
    const generated = generateReport({
      baseReport: {
        passes: 4,
        failures: 0,
        flaky: 0,
        duration: 1000,
      },
      diffReport: {
        passes: 2,
        failures: 1,
        flaky: 1,
        duration: 2000,
      },
      baseIdentifier: 'base',
      diffIdentifier: 'diff',
    });

    const expected = `
|               | ${'base'}      | ${'diff'}      | change                                       |
|---------------|------------------------|------------------------|----------------------------------------------|
| passes        | ${4}   | ${2}   | ${-2}     |
| failures      | ${0} | ${1} | ${1} |
| flaky         | ${0}    | ${1}    | ${1}       |
| duration (ms) | ${1000} | ${2000} | ${1000} |
`;
    
    expect(generated).to.equal(expected);
  });
});
