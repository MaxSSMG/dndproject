import { ref } from "vue";
import { useJsonStore } from "@/composables/useJsonStore";

export function useClases() {
  const clases = ref(null);
  const clase = ref(null);

  const { loadClases: loadClassList, loadClaseById: loadClass } = useJsonStore();

  async function loadClases() {
    try {
      clases.value = loadClassList();
    } catch (err) {
      console.error("Failed to load class:", err);
    }
  }

  async function loadClaseById(id) {
    try {
      clase.value = loadClass(id);
    } catch (err) {
      console.error("Failed to load class:", err);
    }
  }

  return {
    clase,
    clases,
    loadClases,
    loadClaseById,
  };
}