export const useGlobalId = createGlobalState(() => {
  const count = ref(0);
  return { count };
});

export const generateId = (prefix = '') => {
  const { count } = useGlobalId();
  const countVal = get(count);
  set(count, countVal + 1);

  return `${prefix}-${get(count)}`;
};
