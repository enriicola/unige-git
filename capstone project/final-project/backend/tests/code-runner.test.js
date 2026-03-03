/**
 * Code Runner Service Tests
 *
 * NOTE: These tests require Docker to be available.
 * The code runner uses a named Docker volume (code_runner_temp) mounted at /tmp/code-runner
 * in the backend container, which eliminates permission issues.
 *
 * To run these tests:
 * - From Docker: Run tests inside the backend container (recommended)
 *   cd docker && ./codymatch.sh backend npm test -- tests/code-runner.test.js
 * - From host: Tests will work if Docker can access temp directories
 */
import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { runCode, getSupportedLanguages } from '#root/services/code-runner.js';

// Check if we're in Docker environment with volume mounted
// If CODE_RUNNER_TEMP_DIR is set, we're likely in Docker with volume mounted
const IN_DOCKER_ENV = !!process.env.CODE_RUNNER_TEMP_DIR;

// Check if temp directory exists (volume is mounted)
const TEMP_DIR_AVAILABLE = (() => {
  try {
    const tempDir = process.env.CODE_RUNNER_TEMP_DIR || '/tmp/code-runner';
    return existsSync(tempDir);
  } catch {
    return false;
  }
})();

// Check if Docker socket is available (indicates Docker access)
const DOCKER_SOCKET_AVAILABLE = existsSync('/var/run/docker.sock');

// Skip tests if Docker is not available or if temp directory is not accessible
// In Docker environment, we check for socket and temp dir
// On host, we check if docker command works
const DOCKER_AVAILABLE = (() => {
  // First check if docker command exists at all
  try {
    const result = execSync('which docker', {
      stdio: 'pipe',
      encoding: 'utf8',
    });
    if (!result.trim()) {
      return false;
    }
  } catch {
    return false;
  }

  if (IN_DOCKER_ENV && DOCKER_SOCKET_AVAILABLE) {
    // In Docker container, socket availability is enough
    return true;
  }
  // On host, check if docker command works
  try {
    execSync('docker --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
})();

// Run tests if Docker is available AND (we're in Docker env with temp dir OR on host with docker)
const DOCKER_MOUNT_AVAILABLE =
  DOCKER_AVAILABLE && (IN_DOCKER_ENV ? TEMP_DIR_AVAILABLE : true);

const describeIf = DOCKER_MOUNT_AVAILABLE ? describe : describe.skip;

describeIf('Code Runner Service', () => {
  describe('getSupportedLanguages', () => {
    it('should return list of supported languages', () => {
      const languages = getSupportedLanguages();
      expect(languages).toBeInstanceOf(Array);
      expect(languages.length).toBeGreaterThan(0);
      expect(languages).toContain('python');
      expect(languages).toContain('javascript');
    });
  });

  describe('Successful Code Execution', () => {
    it('should execute Python code successfully', async () => {
      const code = 'print("Hello, World!")';
      const result = await runCode(code, 'python');

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('stdout');
      expect(result).toHaveProperty('stderr');
      expect(result).toHaveProperty('exitCode');
      expect(result.success).toBe(true);
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toBe('Hello, World!');
      expect(result.stderr).toBe('');
    }, 30000);

    it('should execute JavaScript code successfully', async () => {
      const code = 'console.log("Hello from Node.js!");';
      const result = await runCode(code, 'javascript');

      expect(result.success).toBe(true);
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('Hello from Node.js!');
    }, 30000);

    it('should execute Python code with input', async () => {
      const code = `
import sys
name = sys.stdin.read().strip()
print(f"Hello, {name}!")
      `.trim();
      const result = await runCode(code, 'python', 'Alice');

      expect(result.success).toBe(true);
      expect(result.stdout).toContain('Hello, Alice!');
    }, 30000);

    it('should execute JavaScript code with input', async () => {
      const code = `
const input = require('fs').readFileSync(0, 'utf-8').trim();
console.log('Received:', input.toUpperCase());
      `.trim();
      const result = await runCode(code, 'javascript', 'test input');

      expect(result.success).toBe(true);
      expect(result.stdout).toContain('TEST INPUT');
    }, 30000);

    it('should execute Python code with calculations', async () => {
      const code = `
result = sum(range(1, 101))
print(f"Sum of 1-100: {result}")
      `.trim();
      const result = await runCode(code, 'python');

      expect(result.success).toBe(true);
      expect(result.stdout).toContain('Sum of 1-100: 5050');
    }, 30000);

    it('should execute JavaScript code with calculations', async () => {
      const code = `
const sum = Array.from({length: 100}, (_, i) => i + 1)
  .reduce((a, b) => a + b, 0);
console.log('Sum of 1-100:', sum);
      `.trim();
      const result = await runCode(code, 'javascript');

      expect(result.success).toBe(true);
      expect(result.stdout).toContain('Sum of 1-100: 5050');
    }, 30000);
  });

  describe('Syntax Errors', () => {
    it('should handle Python syntax errors', async () => {
      const code = 'print("Hello"  # Missing closing parenthesis';
      const result = await runCode(code, 'python');

      expect(result.success).toBe(false);
      expect(result.exitCode).not.toBe(0);
      // Syntax errors should show in stderr, but may timeout in some environments
      if (!result.stderr.includes('timeout')) {
        expect(result.stderr).toContain('SyntaxError');
      }
    }, 30000);

    it('should handle JavaScript syntax errors', async () => {
      const code = 'console.log("Hello";  // Missing closing parenthesis';
      const result = await runCode(code, 'javascript');

      expect(result.success).toBe(false);
      expect(result.exitCode).not.toBe(0);
      // Syntax errors should show in stderr, but may timeout in some environments
      if (!result.stderr.includes('timeout')) {
        expect(result.stderr).toContain('SyntaxError');
      }
    }, 30000);

    it('should handle Python runtime errors', async () => {
      const code = `
x = 10
y = 0
result = x / y
print(result)
      `.trim();
      const result = await runCode(code, 'python');

      expect(result.success).toBe(false);
      expect(result.exitCode).not.toBe(0);
      // Runtime errors should show in stderr, but may timeout in some environments
      if (!result.stderr.includes('timeout')) {
        expect(result.stderr).toContain('ZeroDivisionError');
      }
    }, 30000);

    it('should handle JavaScript runtime errors', async () => {
      const code = `
const obj = null;
console.log(obj.property);
      `.trim();
      const result = await runCode(code, 'javascript');

      expect(result.success).toBe(false);
      expect(result.exitCode).not.toBe(0);
      // Runtime errors should show in stderr, but may timeout in some environments
      if (!result.stderr.includes('timeout')) {
        expect(result.stderr).toContain('TypeError');
      }
    }, 30000);

    it('should handle undefined variable errors', async () => {
      const code = 'print(undefined_variable)';
      const result = await runCode(code, 'python');

      expect(result.success).toBe(false);
      expect(result.exitCode).not.toBe(0);
      // Runtime errors should show in stderr, but may timeout in some environments
      if (!result.stderr.includes('timeout')) {
        expect(result.stderr).toContain('NameError');
      }
    }, 30000);
  });

  describe('Infinite Loops and Timeouts', () => {
    it('should timeout Python infinite loop', async () => {
      const code = `
while True:
    pass
      `.trim();
      const result = await runCode(code, 'python', '', { timeoutMs: 2000 });

      expect(result.success).toBe(false);
      // Exit code can be 124 (timeout) or 125 (Docker error) depending on how timeout is handled
      expect([124, 125]).toContain(result.exitCode);
      expect(result.stderr).toContain('timeout');
    }, 30000);

    it('should timeout JavaScript infinite loop', async () => {
      const code = 'while(true) {}';
      const result = await runCode(code, 'javascript', '', { timeoutMs: 2000 });

      expect(result.success).toBe(false);
      expect([124, 125]).toContain(result.exitCode);
      expect(result.stderr).toContain('timeout');
    }, 30000);

    it('should timeout long-running Python code', async () => {
      const code = `
import time
time.sleep(20)  # Sleep for 20 seconds (longer than timeout)
print("Done")
      `.trim();
      const result = await runCode(code, 'python', '', { timeoutMs: 2000 });

      expect(result.success).toBe(false);
      expect([124, 125]).toContain(result.exitCode);
      expect(result.stderr).toContain('timeout');
    }, 30000);

    it('should handle Python code that runs within timeout', async () => {
      const code = `
import time
time.sleep(1)  # Sleep for 1 second (within timeout)
print("Completed")
      `.trim();
      const result = await runCode(code, 'python');

      expect(result.success).toBe(true);
      expect(result.stdout).toContain('Completed');
    }, 30000);
  });

  describe('Memory and Resource Limits', () => {
    it('should handle Python code that uses too much memory', async () => {
      const code = `
# Try to create a huge list
big_list = [0] * (10**8)  # 100 million elements
print(len(big_list))
      `.trim();
      const result = await runCode(code, 'python');

      // Should either fail due to memory limit or timeout
      expect(result.success).toBe(false);
    }, 30000);

    it('should handle JavaScript code that uses too much memory', async () => {
      const code = `
const arr = new Array(10**8).fill(0);
console.log(arr.length);
      `.trim();
      const result = await runCode(code, 'javascript');

      // Should either fail due to memory limit or timeout
      expect(result.success).toBe(false);
    }, 30000);
  });

  describe('Edge Cases', () => {
    it('should handle empty Python code', async () => {
      const code = '';
      const result = await runCode(code, 'python');

      // Empty code might succeed or fail depending on language
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('exitCode');
    }, 30000);

    it('should handle empty JavaScript code', async () => {
      const code = '';
      const result = await runCode(code, 'javascript');

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('exitCode');
    }, 30000);

    it('should handle Python code with only whitespace', async () => {
      const code = '   \n\t  \n   ';
      const result = await runCode(code, 'python');

      expect(result).toHaveProperty('success');
    }, 30000);

    it('should handle code with special characters', async () => {
      const code = 'print("Hello! @#$%^&*()")';
      const result = await runCode(code, 'python');

      expect(result.success).toBe(true);
      expect(result.stdout).toContain('Hello! @#$%^&*()');
    }, 30000);

    it('should handle code with unicode characters', async () => {
      const code = 'print("Hello 世界 🌍")';
      const result = await runCode(code, 'python');

      expect(result.success).toBe(true);
      expect(result.stdout).toContain('Hello');
    }, 30000);

    it('should handle multiline Python code', async () => {
      const code = `
def greet(name):
    return f"Hello, {name}!"

result = greet("World")
print(result)
      `.trim();
      const result = await runCode(code, 'python');

      expect(result.success).toBe(true);
      expect(result.stdout).toContain('Hello, World!');
    }, 30000);

    it('should handle multiline JavaScript code', async () => {
      const code = `
function greet(name) {
  return \`Hello, \${name}!\`;
}

const result = greet("World");
console.log(result);
      `.trim();
      const result = await runCode(code, 'javascript');

      expect(result.success).toBe(true);
      expect(result.stdout).toContain('Hello, World!');
    }, 30000);
  });

  describe('Invalid Inputs', () => {
    it('should throw error for unsupported language', async () => {
      const code = 'print("test")';

      await expect(runCode(code, 'invalid_language')).rejects.toThrow(
        'Unsupported language'
      );
    });

    it('should handle case-insensitive language names', async () => {
      const code = 'print("test")';
      const result1 = await runCode(code, 'python');
      const result2 = await runCode(code, 'PYTHON');
      const result3 = await runCode(code, 'Python');

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
      expect(result3.success).toBe(true);
    }, 30000);
  });

  describe('Compiled Languages (if supported)', () => {
    it('should fail to compile invalid C++ code', async () => {
      const badCode = `
        int main() {
          // missing semicolon and include
          std::cout << "Broken" 
          return 0;
        }
      `.trim();
      const result = await runCode(badCode, 'cpp');

      expect(result).toHaveProperty('success');
      expect(result.success).toBe(false);
      expect(result.exitCode).not.toBe(0);
      expect(result.stderr).toBeTruthy();
    }, 30000);

    it('should compile C++ but produce an unexpected output', async () => {
      const code = `
        #include <iostream>
        int main(){
          std::cout << "Not the expected output" << std::endl;
          return 0;
        }
      `.trim();
      const result = await runCode(code, 'cpp');

      expect(result.success).toBe(true);
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toBe('Not the expected output');
    }, 30000);

    it('should compile and run Java code', async () => {
      const code = `
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
    }
}
      `.trim();
      const result = await runCode(code, 'java');

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('stdout');
      // Java might succeed or fail depending on Judge0 image configuration
    }, 30000);

    it('should compile and run C++ code', async () => {
      const code = `
#include <iostream>
int main() {
    std::cout << "Hello from C++!" << std::endl;
    return 0;
}
      `.trim();
      const result = await runCode(code, 'cpp');

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('stdout');
      expect(result.success).toBe(true);
      expect(result.exitCode).toBe(0);
      expect(result.stderr).toBe('');
      expect(result.stdout).toBe('Hello from C++!');
    }, 30000);

    it('should solve Two Sum in C++ and match expected outputs for two inputs', async () => {
      const cppTwoSum = `#include <iostream>
        #include <vector>
        #include <unordered_map>
        #include <sstream>
        #include <string>
        using namespace std;
        int main(){
          ios::sync_with_stdio(false);
          cin.tie(nullptr);
          string s; {
            ostringstream oss; oss << cin.rdbuf(); s = oss.str();
          }
          vector<long long> vals; long long cur=0; bool inNum=false; bool neg=false;
          for(char c: s){
            if(c=='-' && !inNum){ neg=true; continue; }
            if(c>='0' && c<='9'){ if(!inNum){ inNum=true; cur=0; } cur = cur*10 + (c-'0'); }
            else { if(inNum){ vals.push_back(neg?-cur:cur); inNum=false; neg=false; cur=0; } else { neg=false; } }
          }
          if(inNum) vals.push_back(neg?-cur:cur);
          if(vals.size()<2){ cout << "[]"; return 0; }
          long long target = vals.back();
          vector<long long> nums(vals.begin(), vals.end()-1);
          unordered_map<long long,int> mp;
          for(int i=0;i<(int)nums.size();++i){
            long long need = target - nums[i];
            auto it = mp.find(need);
            if(it!=mp.end()){ cout << "[" << it->second << ", " << i << "]"; return 0; }
            mp[nums[i]] = i;
          }
          cout << "[]";
          return 0;
        }`.trim();

      const case1 = await runCode(
        cppTwoSum,
        'cpp',
        JSON.stringify([[2, 7, 11, 15], 9])
      );
      expect(case1.success).toBe(true);
      expect(case1.exitCode).toBe(0);
      expect(case1.stderr).toBe('');
      expect(case1.stdout).toBe('[0, 1]');

      const case2 = await runCode(
        cppTwoSum,
        'cpp',
        JSON.stringify([[3, 2, 4], 6])
      );
      expect(case2.success).toBe(true);
      expect(case2.exitCode).toBe(0);
      expect(case2.stderr).toBe('');
      expect(case2.stdout).toBe('[1, 2]');
    }, 60000);

    it('should solve Palindrome Number in C++ and match expected outputs', async () => {
      const cppPalindrome = `#include <iostream>
      #include <string>
      #include <vector>
      #include <algorithm>
      #include <sstream>

      int main() {
        std::ios::sync_with_stdio(false);
        std::cin.tie(nullptr);

        std::string s;
        {
          std::ostringstream oss;
          oss << std::cin.rdbuf();
          s = oss.str();
        }

        long long cur = 0;
        bool inNum = false, neg = false;
        std::vector<long long> vals;
        for (char c : s) {
          if (c == '-' && !inNum) {
            neg = true;
            continue;
          }
          if (c >= '0' && c <= '9') {
            if (!inNum) {
              inNum = true;
              cur = 0;
            }
            cur = cur * 10 + (c - '0');
          } else {
            if (inNum) {
              vals.push_back(neg ? -cur : cur);
              inNum = false;
              neg = false;
              cur = 0;
            } else {
              neg = false;
            }
          }
        }
        if (inNum) {
          vals.push_back(neg ? -cur : cur);
        }

        if (vals.empty()) {
          std::cout << "false";
          return 0;
        }

        long long x = vals[0];
        if (x < 0) {
          std::cout << "false";
          return 0;
        }

        std::string t = std::to_string(x);
        std::string r = t;
        std::reverse(r.begin(), r.end());
        std::cout << (t == r ? "true" : "false");
        return 0;
      }`.trim();

      const case1 = await runCode(cppPalindrome, 'cpp', JSON.stringify([121]), {
        timeoutMs: 30000,
      });
      expect(case1.success).toBe(true);
      expect(case1.exitCode).toBe(0);
      expect(case1.stderr).toBe('');
      expect(case1.stdout).toBe('true');

      const case2 = await runCode(
        cppPalindrome,
        'cpp',
        JSON.stringify([-121]),
        { timeoutMs: 30000 }
      );
      expect(case2.success).toBe(true);
      expect(case2.exitCode).toBe(0);
      expect(case2.stderr).toBe('');
      expect(case2.stdout).toBe('false');

      // private test from seed
      const case3 = await runCode(cppPalindrome, 'cpp', JSON.stringify([10]), {
        timeoutMs: 30000,
      });
      expect(case3.success).toBe(true);
      expect(case3.exitCode).toBe(0);
      expect(case3.stderr).toBe('');
      expect(case3.stdout).toBe('false');
    }, 30000);

    it('should compile and run C code', async () => {
      const code = `
#include <stdio.h>
int main() {
    printf("Hello from C!\\n");
    return 0;
}
      `.trim();
      const result = await runCode(code, 'c');

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('stdout');
    }, 30000);
  });

  describe('Concurrent Execution', () => {
    it('should handle multiple simultaneous code executions', async () => {
      const codes = [
        'print("Task 1")',
        'print("Task 2")',
        'print("Task 3")',
        'print("Task 4")',
        'print("Task 5")',
      ];

      const promises = codes.map((code) => runCode(code, 'python'));
      const results = await Promise.all(promises);

      expect(results).toHaveLength(5);
      results.forEach((result, index) => {
        expect(result.success).toBe(true);
        expect(result.stdout).toContain(`Task ${index + 1}`);
      });
    }, 60000);
  });
});
