import { useJsonStore } from "@/composables/useJsonStore";

export function useStats() {
  const { createStats: createStatRecord, getLastStats: getLatestStatId } = useJsonStore();

  async function createStats(str, dex, con, int, wis, cha) {
    return createStatRecord(str, dex, con, int, wis, cha);
  }

  async function getLastStats() {
    return getLatestStatId();
  }

  return {
    createStats,
    getLastStats,
  };
}
