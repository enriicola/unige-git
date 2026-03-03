import { Router } from 'express';
import MatchSetting from '#root/models/match-setting.js';
import { executeCodeTests } from '#root/services/execute-code-tests.js';
import { validateImportsBlock } from '#root/services/import-validation.js';

const router = Router();

router.post('/run', async (req, res) => {
  try {
    const { matchSettingId, code, language } = req.body;

    if (!matchSettingId) {
      return res.status(400).json({
        success: false,
        error: { message: 'matchSettingId is required' },
      });
    }

    if (!code) {
      return res.status(400).json({
        success: false,
        error: { message: 'code is required' },
      });
    }

    if (!language) {
      return res.status(400).json({
        success: false,
        error: { message: 'language is required' },
      });
    }

    const importValidationError = validateImportsBlock(code, language);
    if (importValidationError)
      return res.status(400).json({
        success: false,
        error: { message: importValidationError },
      });

    const matchSetting = await MatchSetting.findByPk(matchSettingId);

    if (!matchSetting) {
      return res.status(404).json({
        success: false,
        error: { message: 'Match setting not found' },
      });
    }

    const publicTests = matchSetting.publicTests;

    if (!Array.isArray(publicTests) || publicTests.length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'No public tests found for this match setting' },
      });
    }

    // Execute code tests using the service function
    const executionResult = await executeCodeTests({
      code,
      language,
      testCases: publicTests,
      userId: req.user?.id,
    });

    const { testResults, summary, isCompiled, isPassed, errors } =
      executionResult;

    // Set error message if tests failed or if there are execution errors
    let errorMessage = undefined;
    if (errors.length > 0) {
      errorMessage = errors[0].error;
    } else if (!isPassed) {
      // Tests failed but no execution errors (wrong output)
      errorMessage = 'Some tests failed. Check the results for details.';
    }

    const response = {
      success: true,
      matchSettingId,
      data: {
        isCompiled,
        isPassed,
        matchSettingId,
        ...(errorMessage && { error: errorMessage }),
        errors: errors.length > 0 ? errors : undefined,
      },
      summary,
      results: testResults,
    };

    res.json(response);
  } catch (error) {
    let errorMessage = 'An error occurred while processing the request';

    if (error?.message) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error?.toString && error.toString() !== '[object Object]') {
      errorMessage = error.toString();
    } else if (error?.name) {
      errorMessage = `${error.name}: An error occurred`;
    }

    const errorResponse = {
      message: errorMessage,
    };

    if (process.env.NODE_ENV === 'development') {
      if (error?.stack) {
        errorResponse.stack = error.stack;
      }
      if (error?.name) {
        errorResponse.name = error.name;
      }
      if (error?.code) {
        errorResponse.code = error.code;
      }
    }

    res.status(500).json({
      success: false,
      error: errorResponse,
    });
  }
});

export default router;
