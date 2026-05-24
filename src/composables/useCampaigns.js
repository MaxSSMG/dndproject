import { ref } from "vue";
import { useJsonStore } from "@/composables/useJsonStore";

export function useCampaigns() {
  const campaign = ref(null);
  const lastCampaign = ref(null);
  const campaigns = ref(null);
  const campaignsIn = ref(null);

  const {
    loadCampaigns: getCampaigns,
    loadUsersCampaigns: getUserCampaigns,
    loadCampaign: getCampaign,
    createCampaign: createNewCampaign,
    addToCampaign: addCharacterToCampaign,
    searchCampaign: searchByName,
    editCampaign: updateCampaign,
    campaignMember: loadCampaignsForUser,
    kickFromCampaign: removeCharacterFromCampaign,
    getLastCampaign: getMostRecentCampaign,
    deleteCampaign: removeCampaign,
    leaveCampaign: leaveCampaignForUser,
  } = useJsonStore();

  async function loadCampaigns(id) {
    try {
      campaigns.value = getCampaigns(id);
    } catch (err) {
      console.error("Failed to load campaigns:", err);
    }
  }

  async function loadCampaign(id) {
    try {
      campaign.value = getCampaign(id);
    } catch (err) {
      console.error("Failed to load campaign:", err);
    }
  }

  async function loadUsersCampaigns(id) {
    try {
      campaigns.value = getUserCampaigns(id);
    } catch (err) {
      console.error("Failed to load campaigns:", err);
    }
  }

  async function createCampaign(id) {
    return createNewCampaign("New Campaign", id);
  }

  async function addToCampaign(campaignId, id) {
    return addCharacterToCampaign(campaignId, id);
  }

  async function searchCampaign(nom) {
    try {
      campaigns.value = searchByName(nom);
    } catch (err) {
      console.error("Failed to load campaigns:", err);
    }
  }

  async function editCampaign(nom, id) {
    return updateCampaign(nom, id);
  }

  async function campaignMember(id) {
    try {
      campaignsIn.value = loadCampaignsForUser(id);
    } catch (err) {
      console.error("Failed to load campaigns:", err);
    }
  }

  async function kickFromCampaign(personaje, campanya) {
    return removeCharacterFromCampaign(personaje, campanya);
  }

  async function getLastCampaign() {
    lastCampaign.value = getMostRecentCampaign();
  }

  async function deleteCampaign(id) {
    const result = removeCampaign(id);
    lastCampaign.value = getMostRecentCampaign();
    return result;
  }

  async function leaveCampaign(userId, campaignId) {
    return leaveCampaignForUser(userId, campaignId);
  }

  return {
    campaign,
    lastCampaign,
    campaigns,
    campaignsIn,
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
  };
}
