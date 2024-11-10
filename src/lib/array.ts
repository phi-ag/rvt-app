export const isEqual = <T>(lhs: ArrayLike<T>, rhs: ArrayLike<T>): boolean => {
  if (lhs === rhs) return true;
  if (!lhs || !rhs) return false;
  if (lhs.length !== rhs.length) return false;

  for (let i = 0; i < lhs.length; i++) {
    if (lhs[i] !== rhs[i]) return false;
  }

  return true;
};

export const isZero = <T>(array: ArrayLike<T>) => {
  if (!array?.length) return false;

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < array.length; i++) {
    if (array[i] !== 0) return false;
  }

  return true;
};
