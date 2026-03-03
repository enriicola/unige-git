import { clsx } from 'clsx';

import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const validateIncorrectInput = (
  inputStr,
  outputStr,
  publicTests = []
) => {
  if (!inputStr?.trim() || !outputStr?.trim()) {
    return {
      valid: false,
      message:
        "This vote won't count until you provide both input and expected output",
    };
  }

  try {
    const inputJson = JSON.parse(inputStr);
    const outputJson = JSON.parse(outputStr);

    if (!Array.isArray(inputJson) || !Array.isArray(outputJson)) {
      return {
        valid: false,
        error:
          'Input and output must be valid array values (e.g., [1,2,4], [true,false], ["a","b"]).',
      };
    }

    if (inputJson.length === 0) {
      return { valid: false, error: 'Input array cannot be empty (e.g. [])' };
    }

    const isPublic = publicTests.some(
      (pt) =>
        JSON.stringify(pt.input) === JSON.stringify(inputJson) ||
        pt.input === inputStr
    );

    if (isPublic) {
      return {
        valid: false,
        error:
          'You cannot use public test cases. Please provide a different test case.',
      };
    }

    return { valid: true };
  } catch (e) {
    return {
      valid: false,
      error:
        'Input and output must be valid array values (e.g., [1,2,4], [true,false], ["a","b"]).',
    };
  }
};
