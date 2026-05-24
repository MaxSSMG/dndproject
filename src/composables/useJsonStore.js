const STORAGE_KEY = "projectdnd-json-store";

function createEmptyStore() {
  return {
    users: [],
    campaigns: [],
    characters: [],
    classes: [],
    habilidades: [],
    stats: [],
    items: [],
    campaignCharacterLinks: [],
    classHabilidadLinks: [],
    characterItemLinks: [],
  };
}

function createSeedStore() {
  const store = createEmptyStore();

  store.users.push(
    { id: 1, nombre: "Max", contrasenya: "Max" },
    { id: 2, nombre: "Sara", contrasenya: "Sara" },
  );

  store.classes.push(
    { id: 1, nombre: "Mago", dadoVida: "1d6" },
    { id: 2, nombre: "Guerrero", dadoVida: "1d10" },
  );

  store.habilidades.push(
    {
      id: 1,
      nombre: "Bola de fuego",
      descripcion:
        "Un rayo brillante surge de tu dedo índice hasta un punto que elijas dentro del alcance y explota con un leve estruendo en un estallido de llamas.",
      danyo: "8d6",
      bonus: "INT",
    },
    {
      id: 2,
      nombre: "Agarre electrizante",
      descripcion:
        "Un rayo surge de tu mano para golpear a una criatura que estás intentando tocar.",
      danyo: "1d8",
      bonus: "INT",
    },
    {
      id: 3,
      nombre: "Rayo de escarcha",
      descripcion:
        "Un rayo helador de luz de color azul blanquecino alcanza a una criatura dentro del alcance.",
      danyo: "1d8",
      bonus: "INT",
    },
    {
      id: 4,
      nombre: "Furia",
      descripcion:
        "Luchas con una ferocidad primitiva en la batalla. Durante tu turno, puedes dejarte llevar por la furia como acción adicional. Mientras estás en furia, consigues resistencia al ataque fisico.",
      danyo: null,
      bonus: null,
    },
  );

  store.classHabilidadLinks.push(
    { claseId: 1, habilidadId: 1 },
    { claseId: 1, habilidadId: 2 },
    { claseId: 1, habilidadId: 3 },
    { claseId: 2, habilidadId: 4 },
  );

  return store;
}

function isBrowser() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function readStore() {
  if (!isBrowser()) {
    return createSeedStore();
  }

  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    const seeded = createSeedStore();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }

  try {
    const parsed = JSON.parse(raw);

    return normalizeStore(parsed);
  } catch {
    const seeded = createSeedStore();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
}

function normalizeStore(parsedStore) {
  const store = createEmptyStore();

  store.users = Array.isArray(parsedStore?.users) ? parsedStore.users : [];
  store.campaigns = Array.isArray(parsedStore?.campaigns) ? parsedStore.campaigns : [];
  store.characters = Array.isArray(parsedStore?.characters) ? parsedStore.characters : [];
  store.classes = Array.isArray(parsedStore?.classes) ? parsedStore.classes : [];
  store.habilidades = Array.isArray(parsedStore?.habilidades) ? parsedStore.habilidades : [];
  store.stats = Array.isArray(parsedStore?.stats) ? parsedStore.stats : [];
  store.items = Array.isArray(parsedStore?.items) ? parsedStore.items : [];
  store.campaignCharacterLinks = Array.isArray(parsedStore?.campaignCharacterLinks)
    ? parsedStore.campaignCharacterLinks
    : [];
  store.classHabilidadLinks = Array.isArray(parsedStore?.classHabilidadLinks)
    ? parsedStore.classHabilidadLinks
    : [];
  store.characterItemLinks = Array.isArray(parsedStore?.characterItemLinks)
    ? parsedStore.characterItemLinks
    : [];

  return store;
}

function persistStore(store) {
  if (!isBrowser()) {
    return store;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  return store;
}

function nextId(items) {
  if (!items.length) {
    return 1;
  }

  return Math.max(...items.map((item) => item.id ?? 0)) + 1;
}

function findUserById(store, id) {
  return store.users.find((user) => user.id === Number(id));
}

function findClassById(store, id) {
  return store.classes.find((item) => item.id === Number(id));
}

function findAbilityById(store, id) {
  return store.habilidades.find((item) => item.id === Number(id));
}

function findCampaignById(store, id) {
  return store.campaigns.find((campaign) => campaign.id === Number(id));
}

function findStatsById(store, id) {
  return store.stats.find((stats) => stats.id === Number(id));
}

function findCharacterById(store, id) {
  return store.characters.find((character) => character.id === Number(id));
}

function getCharacterCampaignLink(store, characterId) {
  return store.campaignCharacterLinks.find((link) => link.personajeId === Number(characterId));
}

export function useJsonStore() {
  function getStore() {
    return readStore();
  }

  function seedDemoData() {
    const store = getStore();

    if (store.users.length > 0 || store.classes.length > 0 || store.habilidades.length > 0) {
      return store;
    }

    const seeded = createSeedStore();
    persistStore(seeded);
    return seeded;
  }

  function resetStore() {
    return persistStore(createEmptyStore());
  }

  function login(username, password) {
    const store = getStore();
    return store.users.find(
      (user) => user.nombre === username && user.contrasenya === password,
    );
  }

  function register(username, password) {
    const store = getStore();
    const user = {
      id: nextId(store.users),
      nombre: username,
      contrasenya: password,
    };

    store.users.push(user);
    persistStore(store);
    return user;
  }

  function getName(id) {
    const store = getStore();
    const user = findUserById(store, id);
    return user?.nombre ?? null;
  }

  function createStats(str, dex, con, int, wis, cha) {
    const store = getStore();
    const stat = {
      id: nextId(store.stats),
      str,
      dex,
      con,
      int,
      wis,
      cha,
    };

    store.stats.push(stat);
    persistStore(store);
    return stat.id;
  }

  function getLastStats() {
    const store = getStore();
    return store.stats.at(-1)?.id ?? null;
  }

  function loadClases() {
    return getStore().classes;
  }

  function loadClaseById(id) {
    return findClassById(getStore(), id);
  }

  function loadHabilidades(classId) {
    const store = getStore();
    return store.classHabilidadLinks
      .filter((link) => link.claseId === Number(classId))
      .map((link) => findAbilityById(store, link.habilidadId))
      .filter(Boolean);
  }

  function loadItems(characterId) {
    const store = getStore();

    return store.characterItemLinks
      .filter((link) => link.personajeId === Number(characterId))
      .map((link) => findItemById(store, link.itemId))
      .filter(Boolean);
  }

  function findItemById(store, id) {
    return store.items.find((item) => item.id === Number(id));
  }

  function loadCampaigns(currentUserId) {
    const store = getStore();

    return store.campaigns
      .filter((campaign) => campaign.campanyaDM !== Number(currentUserId))
      .map((campaign) => ({
        campId: campaign.id,
        nombre: campaign.nombre,
        dm: getName(campaign.campanyaDM),
      }));
  }

  function loadUsersCampaigns(currentUserId) {
    const store = getStore();

    return store.campaigns
      .filter((campaign) => campaign.campanyaDM === Number(currentUserId))
      .map((campaign) => ({
        campId: campaign.id,
        nombre: campaign.nombre,
        dm: getName(campaign.campanyaDM),
      }));
  }

  function loadCampaign(id) {
    const store = getStore();
    const campaign = findCampaignById(store, id);

    if (!campaign) {
      return null;
    }

    return {
      campId: campaign.id,
      nombre: campaign.nombre,
      dmId: campaign.campanyaDM,
      dm: getName(campaign.campanyaDM),
    };
  }

  function createCampaign(name, userId) {
    const store = getStore();
    const campaign = {
      id: nextId(store.campaigns),
      nombre: name,
      campanyaDM: Number(userId),
    };

    store.campaigns.push(campaign);
    persistStore(store);
    return campaign;
  }

  function addToCampaign(campaignId, characterId) {
    const store = getStore();

    const exists = store.campaignCharacterLinks.some(
      (link) => link.campanyaId === Number(campaignId) && link.personajeId === Number(characterId),
    );

    if (exists) {
      return false;
    }

    store.campaignCharacterLinks.push({
      campanyaId: Number(campaignId),
      personajeId: Number(characterId),
    });
    persistStore(store);
    return true;
  }

  function searchCampaign(term) {
    const store = getStore();

    return store.campaigns
      .filter((campaign) => campaign.nombre.toLowerCase().includes(term.toLowerCase()))
      .map((campaign) => ({
        campId: campaign.id,
        nombre: campaign.nombre,
        dm: getName(campaign.campanyaDM),
      }));
  }

  function editCampaign(name, id) {
    const store = getStore();
    const campaign = findCampaignById(store, id);

    if (!campaign) {
      return null;
    }

    campaign.nombre = name;
    persistStore(store);
    return campaign;
  }

  function campaignMember(userId) {
    const store = getStore();
    const userCharacters = store.characters
      .filter((character) => character.personajeUsuario === Number(userId))
      .map((character) => character.id);

    return store.campaigns
      .filter((campaign) =>
        store.campaignCharacterLinks.some(
          (link) =>
            link.campanyaId === campaign.id && userCharacters.includes(link.personajeId),
        ),
      )
      .map((campaign) => ({
        campId: campaign.id,
        nombre: campaign.nombre,
        dm: getName(campaign.campanyaDM),
      }));
  }

  function kickFromCampaign(characterId, campaignId) {
    const store = getStore();

    store.campaignCharacterLinks = store.campaignCharacterLinks.filter(
      (link) =>
        !(link.personajeId === Number(characterId) && link.campanyaId === Number(campaignId)),
    );
    persistStore(store);
    return true;
  }

  function getLastCampaign() {
    const store = getStore();
    return store.campaigns.at(-1) ?? null;
  }

  function deleteCampaign(id) {
    const store = getStore();

    store.campaigns = store.campaigns.filter((campaign) => campaign.id !== Number(id));
    store.campaignCharacterLinks = store.campaignCharacterLinks.filter(
      (link) => link.campanyaId !== Number(id),
    );
    persistStore(store);
    return true;
  }

  function leaveCampaign(userId, campaignId) {
    const store = getStore();
    const userCharacterIds = store.characters
      .filter((character) => character.personajeUsuario === Number(userId))
      .map((character) => character.id);

    store.campaignCharacterLinks = store.campaignCharacterLinks.filter(
      (link) =>
        !(link.campanyaId === Number(campaignId) && userCharacterIds.includes(link.personajeId)),
    );
    persistStore(store);
    return true;
  }

  function loadCharacterFromId(id) {
    const store = getStore();
    const character = findCharacterById(store, id);

    if (!character) {
      return null;
    }

    const classData = findClassById(store, character.personajeClase);
    const stats = findStatsById(store, character.personajeStats);
    const campaignLink = getCharacterCampaignLink(store, character.id);
    const campaign = campaignLink ? findCampaignById(store, campaignLink.campanyaId) : null;

    return {
      character: {
        charId: character.id,
        nombre: character.nombre,
        nivel: character.personajeNivel,
        health: character.health,
        maxHealth: character.maxHealth,
        clase: classData?.nombre ?? null,
      },
      clase: classData ? { id: classData.id } : null,
      abilityScores: stats
        ? {
            str: stats.str,
            dex: stats.dex,
            con: stats.con,
            int: stats.int,
            wis: stats.wis,
            cha: stats.cha,
          }
        : null,
      campaign: campaign
        ? {
            campId: campaign.id,
            nombre: campaign.nombre,
          }
        : null,
    };
  }

  function loadCharactersFromUser(userId) {
    const store = getStore();

    return store.characters
      .filter((character) => character.personajeUsuario === Number(userId))
      .map((character) => {
        const classData = findClassById(store, character.personajeClase);
        const campaignLink = getCharacterCampaignLink(store, character.id);
        const campaign = campaignLink ? findCampaignById(store, campaignLink.campanyaId) : null;

        return {
          charId: character.id,
          nombre: character.nombre,
          nivel: character.personajeNivel,
          clase: classData?.nombre ?? null,
          campanya: campaign?.nombre ?? null,
        };
      });
  }

  function loadCharactersFromCampaign(campaignId) {
    const store = getStore();
    const linkIds = store.campaignCharacterLinks
      .filter((link) => link.campanyaId === Number(campaignId))
      .map((link) => link.personajeId);

    return store.characters
      .filter((character) => linkIds.includes(character.id))
      .map((character) => {
        const classData = findClassById(store, character.personajeClase);

        return {
          charId: character.id,
          nombre: character.nombre,
          nivel: character.personajeNivel,
          clase: classData?.nombre ?? null,
          campanya: findCampaignById(store, campaignId)?.nombre ?? null,
        };
      });
  }

  function createCharacter(nombre, nivel, health, clase, stats, usuario) {
    const store = getStore();
    const character = {
      id: nextId(store.characters),
      nombre,
      health,
      maxHealth: health,
      personajeNivel: nivel,
      personajeClase: Number(clase),
      personajeStats: Number(stats),
      personajeUsuario: Number(usuario),
    };

    store.characters.push(character);
    persistStore(store);
    return character;
  }

  function changeHP(hp, id) {
    const store = getStore();
    const character = findCharacterById(store, id);

    if (!character) {
      return null;
    }

    character.health = hp;
    persistStore(store);
    return character;
  }

  function editCharacter(nombre, nivel, health, clase, stats, id) {
    const store = getStore();
    const character = findCharacterById(store, id);

    if (!character) {
      return null;
    }

    character.nombre = nombre;
    character.personajeNivel = nivel;
    character.health = health;
    character.maxHealth = health;
    character.personajeClase = Number(clase);
    character.personajeStats = Number(stats);
    persistStore(store);
    return character;
  }

  function getStoreSnapshot() {
    return getStore();
  }

  return {
    getStoreSnapshot,
    seedDemoData,
    resetStore,
    login,
    register,
    getName,
    createStats,
    getLastStats,
    loadClases,
    loadClaseById,
    loadHabilidades,
    loadItems,
    loadCampaigns,
    loadUsersCampaigns,
    loadCampaign,
    createCampaign,
    addToCampaign,
    searchCampaign,
    editCampaign,
    campaignMember,
    kickFromCampaign,
    getLastCampaign,
    deleteCampaign,
    leaveCampaign,
    loadCharacterFromId,
    loadCharactersFromUser,
    loadCharactersFromCampaign,
    createCharacter,
    changeHP,
    editCharacter,
  };
}

export function getJsonStoreSnapshot() {
  return readStore();
}
