export const useGlobalId = createGlobalState(() => {
  const count = ref(0);

  const nextId = () => {
    const countVal = get(count) + 1;
    set(count, countVal);

    return countVal;
  };

  return { count, nextId };
});

export const generateId = (prefix = '') => {
  const { nextId } = useGlobalId();

  return `${prefix}-${nextId()}`;
};
