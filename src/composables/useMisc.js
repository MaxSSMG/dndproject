import { useSQLite } from "@/composables/useSQLite";

export function useMisc() {
    const { executeQuery, demoData } = useSQLite();
    async function drop() {
        const result = await executeQuery(`
            PRAGMA foreign_keys = OFF;

            DROP TABLE IF EXISTS Personaje_tiene_Item;
            DROP TABLE IF EXISTS Personaje_tiene_Habilidad;
            DROP TABLE IF EXISTS Clase_tiene_Habilidad;
            DROP TABLE IF EXISTS Campanya_tiene_Personaje;

            DROP TABLE IF EXISTS Item;
            DROP TABLE IF EXISTS Stats;
            DROP TABLE IF EXISTS Habilidad;
            DROP TABLE IF EXISTS Clase;
            DROP TABLE IF EXISTS Personaje;
            DROP TABLE IF EXISTS Campanya;
            DROP TABLE IF EXISTS Usuario;

            PRAGMA foreign_keys = ON;
        `);
        console.log("Tablas borradas")
        return result
    }
    return {
        drop,
        demoData,
    };
}
