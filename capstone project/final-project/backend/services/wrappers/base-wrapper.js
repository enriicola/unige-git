export function validateWrapper(wrapper) {
  if (typeof wrapper !== 'function') {
    throw new Error('Wrapper must be a function');
  }

  if (wrapper.length < 1) {
    throw new Error(
      'Wrapper function must accept at least one parameter (userCode)'
    );
  }

  return true;
}
