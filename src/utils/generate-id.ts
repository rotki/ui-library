export const useGlobalId = createGlobalState(() => {
  const count = ref<number>(0);

  const nextId = (): number => {
    const increasedCount = get(count) + 1;
    set(count, increasedCount);

    return increasedCount;
  };

  return { count, nextId };
});

export function generateId(prefix = '') {
  const { nextId } = useGlobalId();

  return `${prefix}-${nextId()}`;
}
