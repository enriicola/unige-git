export function wrapPythonCode(userCode) {
  const wrapper = `import sys
import json

# Read and parse input from stdin
input_data = json.loads(sys.stdin.read().strip())

# User's code
${userCode}

# Result section
# Your output will be captured from stdout
# For best results, print JSON format: print(json.dumps(result))
`;

  return wrapper;
}

export const pythonWrapperMeta = {
  supportedLanguages: ['python', 'py'],
  description:
    'Python wrapper that reads JSON input from stdin and provides input_data variable',
  version: '^3.0.0',
};
