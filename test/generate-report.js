import { expect } from 'chai';
const generateReport = require('../lib/generate-report');

describe('Generate report', function () {
  it('should calculate changes with explicit directional indicators and humanised durations', function () {
    const generated = generateReport({
      baseReport: {
        passes: 4,
        failures: 0,
        flaky: 0,
        duration: 2500,
      },
      diffReport: {
        passes: 2,
        failures: 1,
        flaky: 1,
        duration: 1200,
      },
      baseIdentifier: 'base',
      diffIdentifier: 'diff',
    });

    const expected = `
## Ember Test Audit comparison
|          | ${'base'}      | ${'diff'}      | change                                       |
|----------|------------------------|------------------------|----------------------------------------------|
| passes   | ${4}   | ${2}   | ${-2}     |
| failures | ${0} | ${1} | ${'+1'} |
| flaky    | ${0}    | ${1}    | ${'+1'}       |
| duration | ${'02s 500ms'} | ${'01s 200ms'} | ${'-01s 300ms'} |
`;
    
    expect(generated).to.equal(expected);
  });
});
