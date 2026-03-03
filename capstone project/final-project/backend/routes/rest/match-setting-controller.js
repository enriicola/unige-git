import { Router } from 'express';
import { Op } from 'sequelize';
import MatchSetting from '#root/models/match-setting.js';
import { MatchSettingStatus } from '#root/models/enum/enums.js';
import Match from '#root/models/match.js';
import ChallengeMatchSetting from '#root/models/challenge-match-setting.js';
import { executeCodeTests } from '#root/services/execute-code-tests.js';
import { validateImportsBlock } from '#root/services/import-validation.js';
import { handleException } from '#root/services/error.js';
const router = Router();

const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

const normalizeText = (value) => (typeof value === 'string' ? value : '');

const normalizeTests = (value) => (Array.isArray(value) ? value : []);

const MAX_EXECUTION_ERROR_MESSAGE_LENGTH = 220;
const CPP_UNQUALIFIED_STL_SYMBOL_REGEX =
  /\b(string|vector|unordered_map|map|set|queue|stack|deque|list|pair|cin|cout|cerr|clog|getline)\b/i;
const CPP_NOT_DECLARED_REGEX = /was not declared in this scope/i;

const isBlank = (value) =>
  typeof value !== 'string' || value.trim().length === 0;

const hasTestCases = (tests) => Array.isArray(tests) && tests.length > 0;

const hasValidTestCases = (tests) =>
  Array.isArray(tests) &&
  tests.length > 0 &&
  tests.every(
    (testCase) =>
      testCase &&
      Object.prototype.hasOwnProperty.call(testCase, 'input') &&
      Object.prototype.hasOwnProperty.call(testCase, 'output')
  );

const sanitizeExecutionMessage = (value) => {
  if (typeof value !== 'string') return null;

  const normalized = value.replace(/\s+/g, ' ').trim();
  if (!normalized) return null;

  if (normalized.length <= MAX_EXECUTION_ERROR_MESSAGE_LENGTH) {
    return normalized;
  }
  return `${normalized.slice(0, MAX_EXECUTION_ERROR_MESSAGE_LENGTH - 3)}...`;
};

const getExecutionFailureDetail = (executionResult) => {
  if (!executionResult || typeof executionResult !== 'object') return null;

  const { errors, testResults } = executionResult;

  if (Array.isArray(errors)) {
    for (const entry of errors) {
      const detail = sanitizeExecutionMessage(entry?.error);
      if (detail) return detail;
    }
  }

  if (Array.isArray(testResults)) {
    for (const testResult of testResults) {
      const stderrDetail = sanitizeExecutionMessage(testResult?.stderr);
      if (stderrDetail) return stderrDetail;

      const errorDetail = sanitizeExecutionMessage(testResult?.error);
      if (errorDetail) return errorDetail;
    }
  }

  return null;
};

const buildCppNamespaceHint = (detail) => {
  if (typeof detail !== 'string' || !detail.trim()) return null;
  if (!CPP_NOT_DECLARED_REGEX.test(detail)) return null;
  if (!CPP_UNQUALIFIED_STL_SYMBOL_REGEX.test(detail)) return null;

  return 'Hint: add "using namespace std;" in fixed prefix, or use std:: for STL symbols.';
};

const buildPublishFailureMessage = ({
  visibilityLabel,
  executionResult,
  language,
}) => {
  const baseMessage = `Reference solution failed ${visibilityLabel} tests. Fix it before publishing.`;
  const detail = getExecutionFailureDetail(executionResult);
  if (!detail) return baseMessage;

  let message = `${baseMessage} Details: ${detail}`;
  if (language?.toLowerCase() === 'cpp') {
    const cppHint = buildCppNamespaceHint(detail);
    if (cppHint) {
      message = `${message} ${cppHint}`;
    }
  }
  return message;
};

const buildDuplicateTitle = async (title) => {
  const baseTitle = title || 'Untitled match setting';
  const escaped = baseTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = `${baseTitle} (Copy`;
  const candidates = await MatchSetting.findAll({
    attributes: ['problemTitle'],
    where: {
      problemTitle: {
        [Op.iLike]: `${pattern}%`,
      },
    },
  });

  const regex = new RegExp(`^${escaped} \\(Copy(?: (\\d+))?\\)$`, 'i');
  const existing = new Set(
    candidates
      .map((row) => row.problemTitle)
      .filter((value) => typeof value === 'string')
  );

  const baseCopy = `${baseTitle} (Copy)`;
  if (!existing.has(baseCopy)) return baseCopy;

  let maxSuffix = 1;
  existing.forEach((value) => {
    const match = value.match(regex);
    if (!match) return;
    const suffix = match[1] ? Number.parseInt(match[1], 10) : 1;
    if (Number.isFinite(suffix) && suffix > maxSuffix) {
      maxSuffix = suffix;
    }
  });

  return `${baseTitle} (Copy ${maxSuffix + 1})`;
};

const buildReferenceSolutionError = (referenceSolution, language) => {
  if (isBlank(referenceSolution)) {
    return 'Reference solution is required to publish.';
  }
  const importError = validateImportsBlock(referenceSolution, language);
  if (importError) return importError;
  return null;
};

const validatePublishRequirements = (matchSetting) => {
  if (!matchSetting) return 'Match setting not found.';
  if (isBlank(matchSetting.problemTitle)) {
    return 'Problem title is required to publish.';
  }
  if (isBlank(matchSetting.problemDescription)) {
    return 'Problem description is required to publish.';
  }

  const referenceSolutionError = buildReferenceSolutionError(
    matchSetting.referenceSolution,
    'cpp'
  );
  if (referenceSolutionError) return referenceSolutionError;

  const publicTests = normalizeTests(matchSetting.publicTests);
  const privateTests = normalizeTests(matchSetting.privateTests);
  if (!hasTestCases(publicTests)) {
    return 'At least one public test case is required to publish.';
  }
  if (!hasTestCases(privateTests)) {
    return 'At least one private test case is required to publish.';
  }
  if (!hasValidTestCases(publicTests)) {
    return 'All public test cases must include input and output.';
  }
  if (!hasValidTestCases(privateTests)) {
    return 'All private test cases must include input and output.';
  }

  return null;
};

router.get('/matchSettings', async (_req, res) => {
  try {
    const matchSettings = await MatchSetting.findAll();
    res.json({
      success: true,
      data: matchSettings,
    });
  } catch (error) {
    handleException(res, error);
  }
});

router.get('/matchSettingsReady', async (_req, res) => {
  try {
    const matchSettings = await MatchSetting.findAll({
      where: { status: MatchSettingStatus.READY },
    });
    res.json({
      success: true,
      data: matchSettings,
    });
  } catch (error) {
    handleException(res, error);
  }
});

router.post('/matchSettingsByParticipant', async (req, res) => {
  try {
    const { participantId } = req.body;
    const match = await Match.findOne({
      where: { challengeParticipantId: participantId },
    });
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found for the given participant ID',
      });
    }
    const challenge_matchSetting = await ChallengeMatchSetting.findOne({
      where: { id: match.challengeMatchSettingId },
    });
    if (!challenge_matchSetting) {
      return res.status(404).json({
        success: false,
        message: 'ChallengeMatchSetting not found for the given match',
      });
    }
    const matchSetting = await MatchSetting.findOne({
      where: { id: challenge_matchSetting.matchSettingId },
    });
    if (!matchSetting) {
      return res.status(404).json({
        success: false,
        message: 'MatchSetting not found for the given match',
      });
    }
    res.json({
      success: true,
      data: matchSetting,
    });
  } catch (error) {
    handleException(res, error);
  }
});

router.get('/matchSettings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const matchSettingId = Number(id);
    if (!matchSettingId) {
      return res.status(400).json({
        success: false,
        error: { message: 'Match setting ID is required' },
      });
    }

    const matchSetting = await MatchSetting.findByPk(matchSettingId);
    if (!matchSetting) {
      return res.status(404).json({
        success: false,
        error: { message: 'Match setting not found' },
      });
    }

    return res.json({
      success: true,
      data: matchSetting,
    });
  } catch (error) {
    handleException(res, error);
  }
});

router.post('/matchSettings', async (req, res) => {
  try {
    const {
      problemTitle,
      problemDescription,
      referenceSolution,
      publicTests,
      privateTests,
    } = req.body;

    if (isBlank(problemTitle)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Match setting name is required.' },
      });
    }

    const matchSetting = await MatchSetting.create({
      problemTitle: problemTitle.trim(),
      problemDescription: normalizeText(problemDescription),
      referenceSolution: normalizeText(referenceSolution),
      publicTests: normalizeTests(publicTests),
      privateTests: normalizeTests(privateTests),
      status: MatchSettingStatus.DRAFT,
    });

    return res.status(201).json({
      success: true,
      data: matchSetting,
    });
  } catch (error) {
    handleException(res, error);
  }
});

router.put('/matchSettings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const matchSettingId = Number(id);
    if (!matchSettingId) {
      return res.status(400).json({
        success: false,
        error: { message: 'Match setting ID is required' },
      });
    }

    const matchSetting = await MatchSetting.findByPk(matchSettingId);
    if (!matchSetting) {
      return res.status(404).json({
        success: false,
        error: { message: 'Match setting not found' },
      });
    }

    if (matchSetting.status === MatchSettingStatus.READY) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Unpublish this match setting before editing.',
        },
      });
    }

    const updates = {};

    const {
      problemTitle,
      problemDescription,
      referenceSolution,
      publicTests,
      privateTests,
    } = req.body;

    if (hasOwn(req.body, 'problemTitle')) {
      if (isBlank(problemTitle)) {
        return res.status(400).json({
          success: false,
          error: { message: 'Match setting name is required.' },
        });
      }
      updates.problemTitle = problemTitle.trim();
    }

    if (hasOwn(req.body, 'problemDescription')) {
      updates.problemDescription = normalizeText(problemDescription);
    }

    if (hasOwn(req.body, 'referenceSolution')) {
      updates.referenceSolution = normalizeText(referenceSolution);
    }

    if (hasOwn(req.body, 'publicTests')) {
      updates.publicTests = normalizeTests(publicTests);
    }

    if (hasOwn(req.body, 'privateTests')) {
      updates.privateTests = normalizeTests(privateTests);
    }

    const updated = await matchSetting.update(updates);

    return res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    handleException(res, error);
  }
});

router.post('/matchSettings/:id/publish', async (req, res) => {
  try {
    const { id } = req.params;
    const matchSettingId = Number(id);
    if (!matchSettingId) {
      return res.status(400).json({
        success: false,
        error: { message: 'Match setting ID is required' },
      });
    }

    const matchSetting = await MatchSetting.findByPk(matchSettingId);
    if (!matchSetting) {
      return res.status(404).json({
        success: false,
        error: { message: 'Match setting not found' },
      });
    }

    const validationError = validatePublishRequirements(matchSetting);
    if (validationError) {
      return res.status(400).json({
        success: false,
        error: { message: validationError },
      });
    }

    const language = 'cpp';
    const publicTests = normalizeTests(matchSetting.publicTests);
    const privateTests = normalizeTests(matchSetting.privateTests);
    const code = matchSetting.referenceSolution;

    const publicResult = await executeCodeTests({
      code,
      language,
      testCases: publicTests,
      userId: req.user?.id,
    });

    if (!publicResult.isPassed) {
      return res.status(400).json({
        success: false,
        error: {
          message: buildPublishFailureMessage({
            visibilityLabel: 'public',
            executionResult: publicResult,
            language,
          }),
        },
      });
    }

    const privateResult = await executeCodeTests({
      code,
      language,
      testCases: privateTests,
      userId: req.user?.id,
    });

    if (!privateResult.isPassed) {
      return res.status(400).json({
        success: false,
        error: {
          message: buildPublishFailureMessage({
            visibilityLabel: 'private',
            executionResult: privateResult,
            language,
          }),
        },
      });
    }

    const updated = await matchSetting.update({
      status: MatchSettingStatus.READY,
    });

    return res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    handleException(res, error);
  }
});

router.post('/matchSettings/:id/unpublish', async (req, res) => {
  try {
    const { id } = req.params;
    const matchSettingId = Number(id);
    if (!matchSettingId) {
      return res.status(400).json({
        success: false,
        error: { message: 'Match setting ID is required' },
      });
    }

    const matchSetting = await MatchSetting.findByPk(matchSettingId);
    if (!matchSetting) {
      return res.status(404).json({
        success: false,
        error: { message: 'Match setting not found' },
      });
    }

    const updated = await matchSetting.update({
      status: MatchSettingStatus.DRAFT,
    });

    return res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    handleException(res, error);
  }
});

router.post('/matchSettings/:id/duplicate', async (req, res) => {
  try {
    const { id } = req.params;
    const matchSettingId = Number(id);
    if (!matchSettingId) {
      return res.status(400).json({
        success: false,
        error: { message: 'Match setting ID is required' },
      });
    }

    const matchSetting = await MatchSetting.findByPk(matchSettingId);
    if (!matchSetting) {
      return res.status(404).json({
        success: false,
        error: { message: 'Match setting not found' },
      });
    }

    const duplicateTitle = await buildDuplicateTitle(matchSetting.problemTitle);

    const duplicated = await MatchSetting.create({
      problemTitle: duplicateTitle,
      problemDescription: normalizeText(matchSetting.problemDescription),
      referenceSolution: normalizeText(matchSetting.referenceSolution),
      publicTests: normalizeTests(matchSetting.publicTests),
      privateTests: normalizeTests(matchSetting.privateTests),
      status: MatchSettingStatus.DRAFT,
    });

    return res.status(201).json({
      success: true,
      data: duplicated,
    });
  } catch (error) {
    handleException(res, error);
  }
});
export default router;
