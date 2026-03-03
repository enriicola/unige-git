import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import request from 'supertest';

import app from '#root/app_initial.js';
import MatchSetting from '#root/models/match-setting.js';
import { MatchSettingStatus } from '#root/models/enum/enums.js';
import { IMPORTS_END_MARKER } from '#root/services/import-validation.js';

const { mockExecuteCodeTests } = vi.hoisted(() => ({
  mockExecuteCodeTests: vi.fn(),
}));
vi.mock('#root/services/execute-code-tests.js', () => ({
  executeCodeTests: (...args) => mockExecuteCodeTests(...args),
}));

describe('Run API - import validation', () => {
  let matchSetting;

  beforeEach(async () => {
    vi.resetAllMocks();
    mockExecuteCodeTests.mockResolvedValue({
      testResults: [],
      summary: { total: 0, passed: 0, failed: 0, allPassed: true },
      isCompiled: true,
      isPassed: true,
      errors: [],
    });

    matchSetting = await MatchSetting.create({
      problemTitle: 'Imports validation test',
      problemDescription: 'Only includes allowed before marker.',
      referenceSolution: '#include <iostream>\nint main() { return 0; }',
      publicTests: [{ input: ['1'], output: '1' }],
      privateTests: [{ input: ['1'], output: '1' }],
      status: MatchSettingStatus.READY,
    });
  });

  afterEach(async () => {
    if (matchSetting) {
      await MatchSetting.destroy({ where: { id: matchSetting.id } });
    }
  });

  it('rejects non-include lines before the imports marker', async () => {
    const badCode = [
      '#include <iostream>',
      'int notAllowed = 0;',
      IMPORTS_END_MARKER,
      'int main() { return 0; }',
    ].join('\n');

    const res = await request(app).post('/api/rest/run').send({
      matchSettingId: matchSetting.id,
      code: badCode,
      language: 'cpp',
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toMatch(/#include/i);
    expect(mockExecuteCodeTests).not.toHaveBeenCalled();
  });
});
