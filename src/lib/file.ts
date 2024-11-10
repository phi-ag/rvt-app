export const extension = (path: string): string | undefined => {
  if (!path?.length) return;
  const dot = path.lastIndexOf(".");
  if (dot === -1) return;
  return path.slice(dot + 1);
};
