export const equal = <T>(lhs: ArrayLike<T>, rhs: ArrayLike<T>): boolean => {
  if (lhs === rhs) return true;
  if (!lhs || !rhs) return false;
  if (lhs.length !== rhs.length) return false;

  for (let i = 0; i < lhs.length; ++i) {
    if (lhs[i] !== rhs[i]) return false;
  }

  return true;
};
