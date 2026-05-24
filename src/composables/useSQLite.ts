import type { DbId } from "@sqlite.org/sqlite-wasm";
import { sqlite3Worker1Promiser } from "@sqlite.org/sqlite-wasm";
import { ref } from "vue";

const databaseConfig = {
  filename: "file:mydb.sqlite3?vfs=opfs",
  tables: {
    user: {
      name: "Usuario",
      schema: `
        CREATE TABLE IF NOT EXISTS Usuario (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre VARCHAR(45) NOT NULL,
          contrasenya VARCHAR(255) NOT NULL
        );
      `,
    },
      Campanya: {
      name: "Campanya",
      schema: `
        CREATE TABLE IF NOT EXISTS Campanya (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre VARCHAR(45) NOT NULL,
          campanyaDM INTEGER,
          FOREIGN KEY (campanyaDM) REFERENCES Usuario(id) ON DELETE CASCADE
        );
      `,
      },
      Personaje: {
      name: "Personaje",
      schema: `
        CREATE TABLE IF NOT EXISTS Personaje (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre VARCHAR(45) NOT NULL,
          health INTEGER NOT NULL DEFAULT 0,
          maxHealth INTEGER NOT NULL DEFAULT 0, 
          personajeNivel INTEGER NOT NULL,
          personajeStats INTEGER NOT NULL,
          personajeClase INTEGER NOT NULL,
          personajeUsuario INTEGER NOT NULL,
          FOREIGN KEY (personajeStats) REFERENCES Stats(id) ON DELETE CASCADE,
          FOREIGN KEY (personajeClase) REFERENCES Clase(id) ON DELETE CASCADE,
          FOREIGN KEY (personajeUsuario) REFERENCES Usuario(id) ON DELETE CASCADE
        );
      `,
    },
    Clase: {
      name: "Clase",
      schema: `
        CREATE TABLE IF NOT EXISTS Clase (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre VARCHAR(45) NOT NULL,
          dadoVida VARCHAR(45) NOT NULL
        );
      `,
    },
    Habilidad: {
      name: "Habilidad",
      schema: `
        CREATE TABLE IF NOT EXISTS Habilidad (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre VARCHAR(45) NOT NULL,
          descripcion VARCHAR(45) NOT NULL,
          danyo VARCHAR(45),
          bonus VARCHAR(45)
        );
      `,
    },
    Stats: {
      name: "Stats",
      schema: `
        CREATE TABLE IF NOT EXISTS Stats (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          str INTEGER NOT NULL,
          dex INTEGER NOT NULL,
          con INTEGER NOT NULL,
          int INTEGER NOT NULL,
          wis INTEGER NOT NULL,
          cha INTEGER NOT NULL
        );
      `,
    },
    Item: {
      name: "Item",
      schema: `
        CREATE TABLE IF NOT EXISTS Item (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre VARCHAR(45) NOT NULL,
          descripcion VARCHAR(45) NOT NULL,
          cantidad INTEGER NOT NULL
        );
      `,
    },
    Campanya_tiene_Personaje: {
      name: "Campanya_tiene_Personaje",
      schema: `
        CREATE TABLE IF NOT EXISTS Campanya_tiene_Personaje (
          Campanya_id INTEGER,
          Personaje_id INTEGER,
          FOREIGN KEY (Campanya_id) REFERENCES Campanya(id) ON DELETE CASCADE,
          FOREIGN KEY (Personaje_id) REFERENCES Personaje(id) ON DELETE CASCADE
        );
      `,
    },
    Clase_tiene_Habilidad: {
      name: "Clase_tiene_Habilidad",
      schema: `
        CREATE TABLE IF NOT EXISTS Clase_tiene_Habilidad (
          Clase_id INTEGER,
          Habilidad_id INTEGER,
          FOREIGN KEY (Clase_id) REFERENCES Clase(id) ON DELETE CASCADE,
          FOREIGN KEY (Habilidad_id) REFERENCES Habilidad(id) ON DELETE CASCADE
        );
      `,
    },
    Personaje_tiene_Habilidad: {
      name: "Personaje_tiene_Habilidad",
      schema: `
        CREATE TABLE IF NOT EXISTS Personaje_tiene_Habilidad (
          Personaje_id INTEGER,
          Habilidad_id INTEGER,
          FOREIGN KEY (Personaje_id) REFERENCES Personaje(id) ON DELETE CASCADE,
          FOREIGN KEY (Habilidad_id) REFERENCES Habilidad(id) ON DELETE CASCADE
        );
      `,
    },
    Personaje_tiene_Item: {
      name: "Personaje_tiene_Item",
      schema: `
        CREATE TABLE IF NOT EXISTS Personaje_tiene_Item (
          Personaje_id INTEGER,
          Item_id INTEGER,
          FOREIGN KEY (Personaje_id) REFERENCES Personaje(id) ON DELETE CASCADE,
          FOREIGN KEY (Item_id) REFERENCES Item(id) ON DELETE CASCADE
        );
      `,
    },
  },
} as const;

export function useSQLite() {
  const isLoading = ref(false);
  const error = ref<Error | null>(null);
  const isInitialized = ref(false);

  let promiser: ReturnType<typeof sqlite3Worker1Promiser> | null = null;
  let dbId: string | null = null;

  async function initialize() {
    if (isInitialized.value) return true;

    isLoading.value = true;
    error.value = null;

    try {
      // Initialize the SQLite worker
      promiser = await new Promise(resolve => {
        const _promiser = sqlite3Worker1Promiser({
          onready: () => resolve(_promiser),
        });
      });

      if (!promiser) throw new Error("Failed to initialize promiser");

      // Get configuration and open database
      await promiser("config-get", {});
      const openResponse = await promiser("open", {
        filename: databaseConfig.filename,
      });

      if (openResponse.type === "error") {
        throw new Error(openResponse.result.message);
      }

      dbId = openResponse.result.dbId as string;

      // Create initial tables
      for (const table of Object.values(databaseConfig.tables)) {
        await promiser("exec", {
          dbId,
          sql: table.schema,
        });
      }

      isInitialized.value = true;
      return true;
    } catch (err) {
      // error.value = err instanceof Error ? err : new Error("Unknown error");
      console.log(err);
      throw error.value;
    } finally {
      isLoading.value = false;
    }
  }

  async function demoData() {
    await executeQuery("INSERT INTO Usuario (nombre, contrasenya) VALUES (?, ?)", ["Max", "Max"]);
    await executeQuery("INSERT INTO Usuario (nombre, contrasenya) VALUES (?, ?)", ["Sara", "Sara"]);
    await executeQuery("INSERT INTO Clase (nombre, dadoVida) VALUES (?, ?)", ["Mago", "1d6"]);
    await executeQuery("INSERT INTO Habilidad (nombre, descripcion, danyo, bonus) VALUES (?, ?, ?, ?)", ["Bola de fuego", "Un rayo brillante surge de tu dedo índice hasta un punto que elijas dentro del alcance y explota con un leve estruendo en un estallido de llamas.", "8d6", "INT"]);
    await executeQuery("INSERT INTO Habilidad (nombre, descripcion, danyo, bonus) VALUES (?, ?, ?, ?)", ["Agarre electrizante", "Un rayo surge de tu mano para golpear a una criatura que estás intentando tocar.", "1d8", "INT"]);
    await executeQuery("INSERT INTO Habilidad (nombre, descripcion, danyo, bonus) VALUES (?, ?, ?, ?)", ["Rayo de escarcha", "Un rayo helador de luz de color azul blanquecino alcanza a una criatura dentro del alcance.", "1d8", "INT"]);
    await executeQuery("INSERT INTO Clase_tiene_Habilidad (Clase_id, Habilidad_id) VALUES (?, ?)", [1, 1]);
    await executeQuery("INSERT INTO Clase_tiene_Habilidad (Clase_id, Habilidad_id) VALUES (?, ?)", [1, 2]);
    await executeQuery("INSERT INTO Clase_tiene_Habilidad (Clase_id, Habilidad_id) VALUES (?, ?)", [1, 3]);
    await executeQuery("INSERT INTO Clase (nombre, dadoVida) VALUES (?, ?)", ["Guerrero", "1d10"]);
    await executeQuery("INSERT INTO Habilidad (nombre, descripcion, danyo, bonus) VALUES (?, ?, ?, ?)", ["Furia", "Luchas con una ferocidad primitiva en la batalla. Durante tu turno, puedes dejarte llevar por la furia como acción adicional. Mientras estás en furia, consigues resistencia al ataque fisico."]);
    await executeQuery("INSERT INTO Clase_tiene_Habilidad (Clase_id, Habilidad_id) VALUES (?, ?)", [2, 2]);
    console.log("Datos demo creados")
  } 

  async function executeQuery(sql: string, params: unknown[] = []) {
    if (!dbId || !promiser) {
      await initialize();
    }

    isLoading.value = true;
    error.value = null;

    try {
      const result = await promiser!("exec", {
        dbId: dbId as DbId,
        sql,
        bind: params,
        returnValue: "resultRows",
      });

      if (result.type === "error") {
        throw new Error(result.result.message);
      }

      return result;
    } catch (err) {
      console.log(err);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isLoading,
    error,
    isInitialized,
    executeQuery,
    demoData
  };
}