import { SubmissionStatus } from '#root/models/enum/enums.js';

const didAllTestsPass = (summary, testResults) => {
  if (summary) {
    if (summary.allPassed === true) return true;
    if (Number.isFinite(summary.passed) && Number.isFinite(summary.total)) {
      return summary.total > 0 && summary.passed === summary.total;
    }
  }

  if (Array.isArray(testResults) && testResults.length > 0) {
    return testResults.every((result) => result.passed === true);
  }

  return false;
};

export const getSubmissionStatus = (publicResult, privateResult) => {
  const allPublicPassed = didAllTestsPass(
    publicResult?.summary,
    publicResult?.testResults
  );
  const allPrivatePassed = didAllTestsPass(
    privateResult?.summary,
    privateResult?.testResults
  );

  if (!allPublicPassed) return SubmissionStatus.WRONG;
  if (!allPrivatePassed) return SubmissionStatus.IMPROVABLE;
  return SubmissionStatus.PROBABLY_CORRECT;
};
