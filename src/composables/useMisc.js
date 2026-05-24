import { useJsonStore } from "@/composables/useJsonStore";

export function useMisc() {
  const { resetStore, seedDemoData } = useJsonStore();

  async function drop() {
    resetStore();
    console.log("Datos JSON reiniciados");
  }

  async function demoData() {
    seedDemoData();
    console.log("Datos demo asegurados");
  }

  return {
    drop,
    demoData,
  };
}
