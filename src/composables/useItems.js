import { ref } from "vue";
import { useJsonStore } from "@/composables/useJsonStore";

export function useItems() {
  const items = ref(null);

  const { loadItems: loadCharacterItems } = useJsonStore();

  async function loadItems(id) {
    try {
      items.value = loadCharacterItems(id);
    } catch (err) {
      console.error("Failed to load item:", err);
    }
  }

  return {
    items,
    loadItems,
  };
}