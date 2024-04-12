export const useDefaultsStore = defineStore('defaults', () => {
  const itemsPerPage = ref(15);
  const stickyOffset = ref(72);

  return { itemsPerPage, stickyOffset };
});
