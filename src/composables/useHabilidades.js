import { ref } from "vue";
import { useJsonStore } from "@/composables/useJsonStore";

export function useHabilidades() {
  const habilidades = ref(null);

  const { loadHabilidades: loadClassHabilidades } = useJsonStore();

  async function loadHabilidades(id) {
    try {
      habilidades.value = loadClassHabilidades(id);
    } catch (err) {
      console.error("Failed to load habilidad:", err);
    }
  }

  return {
    habilidades,
    loadHabilidades,
  };
}