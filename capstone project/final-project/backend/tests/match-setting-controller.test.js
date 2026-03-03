import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import request from 'supertest';
import app from '#root/app_initial.js';
import MatchSetting from '#root/models/match-setting.js';
import { MatchSettingStatus } from '#root/models/enum/enums.js';
import { IMPORTS_END_MARKER } from '#root/services/import-validation.js';

const { mockExecuteCodeTests } = vi.hoisted(() => ({
  mockExecuteCodeTests: vi.fn().mockImplementation(async ({ testCases }) => ({
    testResults: Array.isArray(testCases)
      ? testCases.map((testCase, index) => ({
          testIndex: index,
          passed: true,
          expectedOutput: testCase?.expectedOutput ?? '',
          actualOutput: testCase?.expectedOutput ?? '',
        }))
      : [],
    summary: {
      total: Array.isArray(testCases) ? testCases.length : 0,
      passed: Array.isArray(testCases) ? testCases.length : 0,
      failed: 0,
      allPassed: true,
    },
    isCompiled: true,
    isPassed: true,
    errors: [],
  })),
}));
vi.mock('#root/services/execute-code-tests.js', () => ({
  executeCodeTests: (...args) => mockExecuteCodeTests(...args),
}));

const PREFIX_END_MARKER = '// __CODYMATCH_PREFIX_END__';
const SOLUTION_END_MARKER = '// __CODYMATCH_SOLUTION_END__';
const DUPLICATE_FLOW_IMPORTS = [
  '#include <iostream>',
  '#include <vector>',
  '#include <unordered_map>',
  '#include <cctype>',
].join('\n');
const DUPLICATE_FLOW_SOLUTION_BODY = `
    string line;
    if (!getline(cin, line)) return 0;

    vector<int> vals;
    for (int i = 0; i < (int)line.size(); ) {
      if (line[i] == '-' || isdigit((unsigned char)line[i])) {
        int sign = 1;
        if (line[i] == '-') {
          sign = -1;
          i++;
        }

        int x = 0;
        while (i < (int)line.size() && isdigit((unsigned char)line[i])) {
          x = x * 10 + (line[i] - '0');
          i++;
        }
        vals.push_back(sign * x);
      } else {
        i++;
      }
    }

    if (vals.size() < 2) {
      cout << "[]";
      return 0;
    }

    int target = vals.back();
    vals.pop_back();

    unordered_map<int, int> pos;
    for (int i = 0; i < (int)vals.size(); i++) {
      int need = target - vals[i];
      auto it = pos.find(need);
      if (it != pos.end()) {
        cout << "[" << it->second << "," << i << "]";
        return 0;
      }
      pos[vals[i]] = i;
    }

    cout << "[]";
`;
const DUPLICATE_FLOW_TEST_CASES = [
  { input: [[2, 7, 11, 15], 9], output: [0, 1] },
];

const buildSplitReferenceSolution = ({ imports, prefix, body, suffix }) =>
  [
    imports,
    IMPORTS_END_MARKER,
    prefix,
    PREFIX_END_MARKER,
    body,
    SOLUTION_END_MARKER,
    suffix,
  ].join('\n\n');

const buildMatchSetting = async (overrides = {}) => {
  const suffix = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  return MatchSetting.create({
    problemTitle: overrides.problemTitle || `Match Setting ${suffix}`,
    problemDescription:
      overrides.problemDescription ?? 'Default problem description',
    referenceSolution:
      overrides.referenceSolution ?? 'int main() { return 0; }',
    publicTests: overrides.publicTests ?? [{ input: [1], output: [1] }],
    privateTests: overrides.privateTests ?? [{ input: [1], output: [1] }],
    status: overrides.status ?? MatchSettingStatus.DRAFT,
  });
};

describe('Match Settings API', () => {
  let createdIds = [];

  beforeEach(() => {
    vi.resetAllMocks();
    mockExecuteCodeTests.mockResolvedValue({
      testResults: [],
      summary: { total: 1, passed: 1, failed: 0, allPassed: true },
      isCompiled: true,
      isPassed: true,
      errors: [],
    });
    createdIds = [];
  });

  afterEach(async () => {
    if (createdIds.length === 0) return;
    await MatchSetting.destroy({ where: { id: createdIds } });
  });

  it('returns draft and ready match settings', async () => {
    const draft = await buildMatchSetting({
      status: MatchSettingStatus.DRAFT,
    });
    const ready = await buildMatchSetting({
      status: MatchSettingStatus.READY,
    });
    createdIds.push(draft.id, ready.id);

    const res = await request(app).get('/api/rest/matchSettings');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const ids = res.body.data.map((setting) => setting.id);
    expect(ids).toEqual(expect.arrayContaining([draft.id, ready.id]));
  });

  it('creates a draft with minimal fields', async () => {
    const res = await request(app).post('/api/rest/matchSettings').send({
      problemTitle: 'Draft only',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.problemTitle).toBe('Draft only');
    expect(res.body.data.status).toBe(MatchSettingStatus.DRAFT);
    expect(res.body.data.problemDescription).toBe('');
    expect(res.body.data.publicTests).toEqual([]);
    expect(res.body.data.privateTests).toEqual([]);

    createdIds.push(res.body.data.id);
  });

  it('blocks updates when the match setting is ready', async () => {
    const matchSetting = await buildMatchSetting({
      status: MatchSettingStatus.READY,
    });
    createdIds.push(matchSetting.id);

    const res = await request(app)
      .put(`/api/rest/matchSettings/${matchSetting.id}`)
      .send({ problemTitle: 'Updated title' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('unpublishes a ready match setting', async () => {
    const matchSetting = await buildMatchSetting({
      status: MatchSettingStatus.READY,
    });
    createdIds.push(matchSetting.id);

    const res = await request(app).post(
      `/api/rest/matchSettings/${matchSetting.id}/unpublish`
    );

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe(MatchSettingStatus.DRAFT);
  });

  it('rejects publish when required fields are missing', async () => {
    const matchSetting = await buildMatchSetting({
      problemDescription: '',
      status: MatchSettingStatus.DRAFT,
    });
    createdIds.push(matchSetting.id);

    const res = await request(app).post(
      `/api/rest/matchSettings/${matchSetting.id}/publish`
    );

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(mockExecuteCodeTests).not.toHaveBeenCalled();
  });

  it('publishes when validation and tests pass', async () => {
    const matchSetting = await buildMatchSetting({
      status: MatchSettingStatus.DRAFT,
    });
    createdIds.push(matchSetting.id);

    const res = await request(app).post(
      `/api/rest/matchSettings/${matchSetting.id}/publish`
    );

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe(MatchSettingStatus.READY);
    expect(mockExecuteCodeTests).toHaveBeenCalledTimes(2);
  });

  it('duplicates a match setting as a draft', async () => {
    const baseTitle = `Original ${Date.now()}`;
    const matchSetting = await buildMatchSetting({
      problemTitle: baseTitle,
      status: MatchSettingStatus.READY,
    });
    createdIds.push(matchSetting.id);

    const res = await request(app).post(
      `/api/rest/matchSettings/${matchSetting.id}/duplicate`
    );

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe(MatchSettingStatus.DRAFT);
    expect(res.body.data.problemTitle).toMatch(/\(Copy/);
    expect(res.body.data.problemTitle).toContain(baseTitle);

    createdIds.push(res.body.data.id);
  });

  it('publishes a duplicated split reference solution when tests pass', async () => {
    const referenceSolution = buildSplitReferenceSolution({
      imports: DUPLICATE_FLOW_IMPORTS,
      prefix: 'using namespace std;\n\nint main() {',
      body: DUPLICATE_FLOW_SOLUTION_BODY,
      suffix: '}',
    });

    const sourceSetting = await buildMatchSetting({
      problemTitle: `Split duplicate ${Date.now()}`,
      problemDescription: 'Two-sum parser challenge',
      referenceSolution,
      publicTests: DUPLICATE_FLOW_TEST_CASES,
      privateTests: DUPLICATE_FLOW_TEST_CASES,
      status: MatchSettingStatus.DRAFT,
    });
    createdIds.push(sourceSetting.id);

    const duplicateRes = await request(app).post(
      `/api/rest/matchSettings/${sourceSetting.id}/duplicate`
    );

    expect(duplicateRes.status).toBe(201);
    expect(duplicateRes.body.success).toBe(true);
    const duplicatedId = duplicateRes.body.data.id;
    createdIds.push(duplicatedId);

    const publishRes = await request(app).post(
      `/api/rest/matchSettings/${duplicatedId}/publish`
    );

    expect(publishRes.status).toBe(200);
    expect(publishRes.body.success).toBe(true);
    expect(publishRes.body.data.status).toBe(MatchSettingStatus.READY);
    expect(mockExecuteCodeTests).toHaveBeenCalledTimes(2);
    expect(mockExecuteCodeTests.mock.calls[0][0]).toMatchObject({
      code: referenceSolution,
      language: 'cpp',
      testCases: DUPLICATE_FLOW_TEST_CASES,
    });
  });

  it('returns a detailed public-test failure for duplicated split C++ references', async () => {
    const referenceSolution = buildSplitReferenceSolution({
      imports: DUPLICATE_FLOW_IMPORTS,
      prefix: 'int main() {',
      body: DUPLICATE_FLOW_SOLUTION_BODY,
      suffix: '}',
    });

    const sourceSetting = await buildMatchSetting({
      problemTitle: `Split duplicate fail ${Date.now()}`,
      problemDescription: 'Two-sum parser challenge',
      referenceSolution,
      publicTests: DUPLICATE_FLOW_TEST_CASES,
      privateTests: DUPLICATE_FLOW_TEST_CASES,
      status: MatchSettingStatus.DRAFT,
    });
    createdIds.push(sourceSetting.id);

    const duplicateRes = await request(app).post(
      `/api/rest/matchSettings/${sourceSetting.id}/duplicate`
    );

    expect(duplicateRes.status).toBe(201);
    expect(duplicateRes.body.success).toBe(true);
    const duplicatedId = duplicateRes.body.data.id;
    createdIds.push(duplicatedId);

    mockExecuteCodeTests.mockResolvedValueOnce({
      testResults: [
        {
          testIndex: 0,
          passed: false,
          stdout: '',
          stderr: "error: 'string' was not declared in this scope",
          expectedOutput: [0, 1],
          actualOutput: null,
          exitCode: 1,
        },
      ],
      summary: { total: 1, passed: 0, failed: 1, allPassed: false },
      isCompiled: false,
      isPassed: false,
      errors: [
        {
          testIndex: 0,
          error: "error: 'string' was not declared in this scope",
          exitCode: 1,
        },
      ],
    });

    const publishRes = await request(app).post(
      `/api/rest/matchSettings/${duplicatedId}/publish`
    );

    expect(publishRes.status).toBe(400);
    expect(publishRes.body.success).toBe(false);
    expect(publishRes.body.error.message).toContain(
      'Reference solution failed public tests. Fix it before publishing.'
    );
    expect(publishRes.body.error.message).toContain(
      "'string' was not declared in this scope"
    );
    expect(publishRes.body.error.message).toContain('using namespace std;');
    expect(mockExecuteCodeTests).toHaveBeenCalledTimes(1);
  });
});
