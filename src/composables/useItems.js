import { ref } from "vue";
import { useSQLite } from "@/composables/useSQLite";

export function useItems() {
  const items = ref(null);

  const { executeQuery } = useSQLite();

  async function loadItems(id) {
    try {
      const result = await executeQuery(
        `SELECT
          *
        FROM Items i
        LEFT JOIN Personaje_tiene_Item pti ON i.id = pti.Item_id
        WHERE pti.Personaje_id = ?`,
        [id]
      ); 
      
      items.value = result.result.resultRows.map((row) => ({
        id: row[0],
        nombre: row[1],
        descripcion: row[2],
        danyo: row[3],
        bonus: row[4],
      }));

    } catch (err) {
      console.error("Failed to load item:", err);
    }
  }

  return {
    items,
    loadItems,
  };
}