import { expect } from 'chai';
const generateFlakinessReport = require('../lib/generate-flakiness-report');

describe('Generate flakiness report', function () {
  it('should report on the names of flaky tests', function () {
    const generated = generateFlakinessReport({
      baseReport: {
        passes: 4,
        failures: 0,
        flaky: 0,
        flakyTestNames: ['a flaky test', 'another flaky test'],
        duration: 2500,
      },
      diffReport: {
        passes: 2,
        failures: 1,
        flaky: 1,
        flakyTestNames: ['a flaky test in this PR', 'a flaky test'],
        duration: 1200,
      },
      baseIdentifier: 'base',
      diffIdentifier: 'diff',
    });

    const expected = `## Ember Test Audit flaky tests

Ember Test Audit detected these flaky tests on ${'base'}:

* a flaky test
* another flaky test

Ember Test Audit detected these flaky tests on ${'diff'}:

* a flaky test in this PR
* a flaky test
`;
    
    expect(generated).to.equal(expected);
  });

  it('can handle a report having no flaky tests', function () {
    const generated = generateFlakinessReport({
        baseReport: {
          passes: 4,
          failures: 0,
          flaky: 0,
          flakyTestNames: ['a flaky test', 'another flaky test'],
          duration: 2500,
        },
        diffReport: {
          passes: 2,
          failures: 1,
          flaky: 1,
          flakyTestNames: [],
          duration: 1200,
        },
        baseIdentifier: 'base',
        diffIdentifier: 'diff',
      });
  
      const expected = `## Ember Test Audit flaky tests

Ember Test Audit detected these flaky tests on ${'base'}:

* a flaky test
* another flaky test
`;
      
      expect(generated).to.equal(expected);
  });

  it('generates an empty string when no reports have flaky tests', function () {
    const generated = generateFlakinessReport({
        baseReport: {
          passes: 4,
          failures: 0,
          flaky: 0,
          flakyTestNames: [],
          duration: 2500,
        },
        diffReport: {
          passes: 2,
          failures: 1,
          flaky: 1,
          flakyTestNames: [],
          duration: 1200,
        },
        baseIdentifier: 'base',
        diffIdentifier: 'diff',
      });
      
      expect(generated).to.equal('');
  })
});
