/** Query arrays arrive as "a,b", as repeated params (already an array) or as a single value. */
export const toArray = ({ value }: { value: unknown }) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.length) return value.split(',');
  return value;
};
