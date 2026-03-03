import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { execSync } from 'child_process';
import MatchSetting from '#root/models/match-setting.js';
import { MatchSettingStatus } from '#root/models/enum/enums.js';
import sequelize from '#root/services/sequelize.js';
import {
  pythonCorrectTwoSum,
  pythonIncorrectTwoSum,
  pythonSyntaxError,
  pythonInfiniteLoop,
} from './student-code/python.js';
import { cppInvalid } from './student-code/cpp.js';

// Check if Docker is available for these API tests
const DOCKER_AVAILABLE = (() => {
  try {
    const result = execSync('which docker', {
      stdio: 'pipe',
      encoding: 'utf8',
    });
    if (!result.trim()) {
      return false;
    }
    execSync('docker --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
})();

const describeIf = DOCKER_AVAILABLE ? describe : describe.skip;

let app;
let testMatchSettingId;
let palindromeSettingId;
let parenthesesSettingId;
let prevTestTimeoutEnv;

const TWO_SUM_TITLE = 'Two Sum (Code Runner API Tests)';
const PALINDROME_TITLE = 'Palindrome Number (Code Runner API Tests)';
const PARENTHESES_TITLE = 'Valid Parentheses (Code Runner API Tests)';

const cppCorrectTwoSum = `
#include <iostream>
#include <vector>
#include <map>
#include <string>
#include <sstream>

std::vector<int> solve(std::vector<int>& nums, int target) {
    std::map<int, int> seen;
    for (int i = 0; i < nums.size(); i++) {
        int need = target - nums[i];
        if (seen.count(need)) {
            return {seen[need], i};
        }
        seen[nums[i]] = i;
    }
    return {};
}

int main() {
   
    std::string line;
    std::getline(std::cin, line);
    
    for (char &c : line) {
        if (c == '[' || c == ']' || c == ',') c = ' ';
    }
    
    std::stringstream ss(line);
    std::vector<int> allNumbers;
    int temp;
    while (ss >> temp) {
        allNumbers.push_back(temp);
    }
    
    if (allNumbers.size() < 2) return 0;
    
    int target = allNumbers.back();
    allNumbers.pop_back(); // Rimuovi il target
    std::vector<int>& nums = allNumbers;
    
    std::vector<int> result = solve(nums, target);
    
    if (result.size() == 2) {
        std::cout << "[" << result[0] << ", " << result[1] << "]";
    } else {
        std::cout << "[]";
    }
    
    return 0;
}
`;

const cppPalindromeCorrect = `
#include <iostream>
#include <string>
#include <algorithm>
#include <vector>

bool solve(int x) {
    if (x < 0) return false;
    std::string s = std::to_string(x);
    std::string r = s;
    std::reverse(r.begin(), r.end());
    return s == r;
}

int main() {
    std::string line;
    std::getline(std::cin, line);
    
    std::string cleanNum;
    for (char c : line) {
        if (isdigit(c) || c == '-') {
            cleanNum += c;
        }
    }
    
    if (!cleanNum.empty()) {
        try {
            int x = std::stoi(cleanNum);
            std::cout << (solve(x) ? "true" : "false");
        } catch (...) {
            std::cout << "false";
        }
    }
    return 0;
}
`;

const cppParenthesesCorrect = `
#include <iostream>
#include <stack>
#include <string>

bool solve(std::string s) {
    std::stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '{' || c == '[') {
            st.push(c);
        } else {
            if (st.empty()) return false;
            char top = st.top();
            if (c == ')' && top != '(') return false;
            if (c == '}' && top != '{') return false;
            if (c == ']' && top != '[') return false;
            st.pop();
        }
    }
    return st.empty();
}

int main() {
    std::string line;
    std::getline(std::cin, line);
    

    std::string input;
    for (char c : line) {
        if (c == '(' || c == ')' || c == '{' || c == '}' || c == '[' || c == ']') {
            input += c;
        }
    }
    
    std::cout << (solve(input) ? "true" : "false");
    return 0;
}
`;

beforeAll(async () => {
  // Force shorter execution timeout for tests only
  prevTestTimeoutEnv = process.env.CODE_RUNNER_TEST_TIMEOUT_MS;
  process.env.CODE_RUNNER_TEST_TIMEOUT_MS = '6000';

  const appModule = await import('#root/app_initial.js');
  app = appModule.default;

  // --- SETUP 1: TWO SUM ---
  const tsPublicTests = [
    { input: [[2, 7, 11, 15], 9], output: [0, 1] },
    { input: [[3, 2, 4], 6], output: [1, 2] },
  ];
  const tsPrivateTests = [
    { input: [[3, 3], 6], output: [0, 1] },
    { input: [[-1, -2, -3, -4, -5], -8], output: [2, 4] },
  ];

  let matchSetting = await MatchSetting.findOne({
    where: { problemTitle: TWO_SUM_TITLE },
  });

  const baseData = {
    problemTitle: TWO_SUM_TITLE,
    problemDescription:
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    referenceSolution: `function solve(input) {
      const [nums, target] = input;
      const seen = new Map();
      for (let i = 0; i < nums.length; i++) {
        const need = target - nums[i];
        if (seen.has(need)) return [seen.get(need), i];
        seen.set(nums[i], i);
      }
      return [];
    }`,
    publicTests: tsPublicTests,
    privateTests: tsPrivateTests,
    status: MatchSettingStatus.READY,
  };

  if (!matchSetting) {
    matchSetting = await MatchSetting.create(baseData);
  } else {
    await matchSetting.update(baseData);
  }
  testMatchSettingId = matchSetting.id;

  // --- SETUP 2: PALINDROME NUMBER ---
  let palindromeMatch = await MatchSetting.findOne({
    where: { problemTitle: PALINDROME_TITLE },
  });
  const palindromeData = {
    problemTitle: PALINDROME_TITLE,
    problemDescription:
      'Given an integer x, return true if x is a palindrome, and false otherwise.',
    referenceSolution: `function isPalindrome(x) {
        if (x < 0) return false;
        const s = String(x);
        return s === s.split('').reverse().join('');
      }`,
    publicTests: [
      { input: [121], output: true },
      { input: [-121], output: false },
    ],
    privateTests: [{ input: [10], output: false }],
    status: MatchSettingStatus.READY,
  };

  if (!palindromeMatch) {
    palindromeMatch = await MatchSetting.create(palindromeData);
  } else {
    await palindromeMatch.update(palindromeData);
  }
  palindromeSettingId = palindromeMatch.id;

  // --- SETUP 3: VALID PARENTHESES ---
  let parenthesesMatch = await MatchSetting.findOne({
    where: { problemTitle: PARENTHESES_TITLE },
  });
  const parenthesesData = {
    problemTitle: PARENTHESES_TITLE,
    problemDescription: 'Determine if the string is valid parentheses.',
    referenceSolution: `function isValid(s) {
        const stack = [];
        const map = { ')': '(', '}': '{', ']': '[' };
        for (const char of s) {
          if (char in map) {
            if (stack.pop() !== map[char]) return false;
          } else {
            stack.push(char);
          }
        }
        return stack.length === 0;
      }`,
    publicTests: [
      { input: ['()'], output: true },
      { input: ['()[]{}'], output: true },
      { input: ['(]'], output: false },
    ],
    privateTests: [
      { input: ['([{}])'], output: true },
      { input: ['((()))[]'], output: true },
      { input: ['([)]'], output: false },
    ],
    status: MatchSettingStatus.READY,
  };

  if (!parenthesesMatch) {
    parenthesesMatch = await MatchSetting.create(parenthesesData);
  } else {
    await parenthesesMatch.update(parenthesesData);
  }
  parenthesesSettingId = parenthesesMatch.id;
}, 60000);

afterAll(async () => {
  if (prevTestTimeoutEnv === undefined) {
    delete process.env.CODE_RUNNER_TEST_TIMEOUT_MS;
  } else {
    process.env.CODE_RUNNER_TEST_TIMEOUT_MS = prevTestTimeoutEnv;
  }

  if (sequelize) await sequelize.close();
});

describeIf('Code Runner API - POST /api/rest/run', () => {
  it('should execute correct Python code and pass all tests', async () => {
    const res = await request(app).post('/api/rest/run').send({
      matchSettingId: testMatchSettingId,
      code: pythonCorrectTwoSum,
      language: 'python',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.summary).toBeDefined();
    expect(res.body.summary.total).toBeGreaterThan(0);

    if (res.body.summary.passed !== res.body.summary.total) {
      // Useful debug in CI logs if it ever fails
      // eslint-disable-next-line no-console
      console.log('Test results:', JSON.stringify(res.body.results, null, 2));
    }

    expect(res.body.summary.passed).toBe(res.body.summary.total);
    expect(res.body.summary.failed).toBe(0);
    expect(res.body.summary.allPassed).toBe(true);
    expect(res.body.results).toBeDefined();
    expect(res.body.results.length).toBe(res.body.summary.total);

    res.body.results.forEach((result) => {
      expect(result.passed).toBe(true);
      expect(result.actualOutput).toEqual(result.expectedOutput);
      expect(result.exitCode).toBe(0);
    });
  }, 180000);

  it('should execute incorrect Python code and fail tests', async () => {
    const res = await request(app).post('/api/rest/run').send({
      matchSettingId: testMatchSettingId,
      code: pythonIncorrectTwoSum,
      language: 'python',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.summary).toBeDefined();
    expect(res.body.summary.total).toBeGreaterThan(0);
    expect(res.body.summary.passed).toBeLessThan(res.body.summary.total);
    expect(res.body.summary.failed).toBeGreaterThan(0);
    expect(res.body.summary.allPassed).toBe(false);
    expect(res.body.data.isCompiled).toBe(true);
    expect(res.body.data.isPassed).toBe(false);
    expect(res.body.data.error).toBeDefined();
    expect(res.body.results).toBeDefined();

    // At least one result should have failed
    const failedResults = res.body.results.filter((r) => !r.passed);
    expect(failedResults.length).toBeGreaterThan(0);

    failedResults.forEach((result) => {
      expect(result.passed).toBe(false);
      expect(result.exitCode).toBe(0); // Code compiled and ran, just wrong output
    });
  }, 180000);

  it('should execute correct C++ code (Two Sum) and pass all tests', async () => {
    const res = await request(app).post('/api/rest/run').send({
      matchSettingId: testMatchSettingId,
      code: cppCorrectTwoSum,
      language: 'cpp',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    if (res.body.summary.passed !== res.body.summary.total) {
      // Debug in console if fail
      // eslint-disable-next-line no-console
      console.log(
        'Two Sum C++ Results:',
        JSON.stringify(res.body.results, null, 2)
      );
    }
    expect(res.body.summary.passed).toBe(res.body.summary.total);
    expect(res.body.summary.failed).toBe(0);
    expect(res.body.summary.allPassed).toBe(true);
    expect(res.body.results).toBeDefined();
    expect(res.body.results.length).toBe(res.body.summary.total);
    res.body.results.forEach((r) => {
      expect(r.passed).toBe(true);
      expect(r.exitCode).toBe(0);
      expect(r.stderr).toBe('');
    });
  }, 180000);

  it('should report compilation errors for invalid C++ code', async () => {
    const res = await request(app).post('/api/rest/run').send({
      matchSettingId: testMatchSettingId,
      code: cppInvalid,
      language: 'cpp',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.summary).toBeDefined();
    expect(res.body.summary.total).toBeGreaterThan(0);
    expect(res.body.summary.passed).toBe(0);
    expect(String(res.body.results[0].stderr).toLowerCase()).toContain('error');
  }, 180000);

  it('should handle Python code with syntax errors', async () => {
    const res = await request(app).post('/api/rest/run').send({
      matchSettingId: testMatchSettingId,
      code: pythonSyntaxError,
      language: 'python',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.summary).toBeDefined();
    expect(res.body.summary.total).toBeGreaterThan(0);
    expect(res.body.data.isPassed).toBe(false);
    expect(res.body.data.error).toBeDefined();
    expect(res.body.results).toBeDefined();

    // All results should have failed with syntax errors
    res.body.results.forEach((result) => {
      expect(result.passed).toBe(false);
      expect(result.exitCode).not.toBe(0);
      expect(result.stderr).toBeDefined();
      expect(result.stderr.length).toBeGreaterThan(0);
      // Check for syntax error indicators in stderr
      const stderrLower = result.stderr.toLowerCase();
      expect(
        stderrLower.includes('syntax') ||
          stderrLower.includes('syntaxerror') ||
          stderrLower.includes('invalid syntax')
      ).toBe(true);
    });
  }, 180000);

  it('should timeout infinite loop code', async () => {
    const res = await request(app).post('/api/rest/run').send({
      matchSettingId: testMatchSettingId,
      code: pythonInfiniteLoop,
      language: 'python',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.isPassed).toBe(false);
    // We mainly care that the code did NOT complete successfully and produced
    // some diagnostic output (stderr/stdout), regardless of the exact text.
    const firstResult = res.body.results[0];
    expect(firstResult).toBeDefined();
    expect(firstResult.exitCode).not.toBe(0);
    const errorMsg = (firstResult.stderr || firstResult.stdout || '').trim();
    expect(errorMsg.length).toBeGreaterThan(0);
  }, 180000);

  // --- NEW TESTS (C++ Palindrome & Parentheses) ---

  it('should execute correct C++ code for Palindrome Number', async () => {
    const res = await request(app).post('/api/rest/run').send({
      matchSettingId: palindromeSettingId,
      code: cppPalindromeCorrect,
      language: 'cpp',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.summary).toBeDefined();

    if (res.body.summary.passed !== res.body.summary.total) {
      // eslint-disable-next-line no-console
      console.log(
        'Palindrome results:',
        JSON.stringify(res.body.results, null, 2)
      );
    }
    expect(res.body.summary.allPassed).toBe(true);
  }, 180000);

  it('should execute correct C++ code for Valid Parentheses', async () => {
    const res = await request(app).post('/api/rest/run').send({
      matchSettingId: parenthesesSettingId,
      code: cppParenthesesCorrect,
      language: 'cpp',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.summary).toBeDefined();

    if (res.body.summary.passed !== res.body.summary.total) {
      // eslint-disable-next-line no-console
      console.log(
        'Parentheses results:',
        JSON.stringify(res.body.results, null, 2)
      );
    }
    expect(res.body.summary.allPassed).toBe(true);
  }, 180000);
});
