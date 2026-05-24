import { ref } from "vue";
import { useJsonStore } from "@/composables/useJsonStore";

export function useCharacters() {
  const character = ref(null);
  const clase = ref(null);
  const characters = ref(null);
  const abilityScores = ref(null);
  const campaign = ref(null);

  const {
    loadCharacterFromId: loadCharacter,
    loadCharactersFromUser: loadUserCharacters,
    loadCharactersFromCampaign: loadCampaignCharacters,
    createCharacter: createNewCharacter,
    changeHP: updateHP,
    editCharacter: updateCharacter,
  } = useJsonStore();

  async function loadCharacterFromId(id) {
    try {
      const result = loadCharacter(id);

      if (result) {
        character.value = result.character;
        abilityScores.value = result.abilityScores;
        campaign.value = result.campaign;
        clase.value = result.clase;
      } else {
        character.value = null;
        abilityScores.value = null;
        campaign.value = null;
        clase.value = null;
      }
    } catch (err) {
      console.error("Failed to load character:", err);
    }
  }

  async function loadCharactersFromUser(id) {
    try {
      characters.value = loadUserCharacters(id);
    } catch (err) {
      console.error("Failed to load character:", err);
    }
  }

  async function loadCharactersFromCampaign(id) {
    try {
      characters.value = loadCampaignCharacters(id);
    } catch (err) {
      console.error("Failed to load character:", err);
    }
  }

  async function createCharacter(nombre, nivel, health, claseId, stats, usuario) {
    try {
      return createNewCharacter(nombre, nivel, health, claseId, stats, usuario);
    } catch (err) {
      console.error("Failed to create character:", err);
    }
  }

  async function changeHP(hp, id) {
    try {
      return updateHP(hp, id);
    } catch (err) {
      console.error("Failed to load characters:", err);
    }
  }

  async function editCharacter(nombre, nivel, health, claseId, stats, id) {
    try {
      return updateCharacter(nombre, nivel, health, claseId, stats, id);
    } catch (err) {
      console.error("Failed to create character:", err);
    }
  }

  return {
    character,
    clase,
    characters,
    abilityScores,
    campaign,
    loadCharacterFromId,
    loadCharactersFromUser,
    loadCharactersFromCampaign,
    createCharacter,
    changeHP,
    editCharacter,
  };
}