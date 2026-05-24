import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {path: '/Login', name: 'Login', component: () => import('@/views/Login.vue')},
    {path: '/', name: 'Home', component: () => import('@/views/Home.vue')},
    {path: '/CharacterSelect', name: 'CharacterSelect', component: () => import('@/views/CharacterSelect.vue')},
    {path: '/Campaigns', name: 'Campaigns', component: () => import('@/views/Campaigns.vue')},
    {path: '/Character/:id', name: 'CharacterSheet', component: () => import('@/views/CharacterSheet.vue')},
    {path: '/CharacterCreate', name: 'CharacterCreate', component: () => import('@/views/CharacterCreate.vue')},
    {path: '/CampaignOverview/:id', name: 'CampaignOverview', component: () => import('@/views/CampaignOverview.vue')},
    {path: '/AddToCampaign/:id', name: 'AddToCampaign', component: () => import('@/views/AddToCampaign.vue')},
    {path: '/MyCampaigns', name: 'MyCampaigns', component: () => import('@/views/MyCampaigns.vue')},
    {path: '/CharacterEdit/:id', name: 'CharacterEdit', component: () => import('@/views/CharacterEdit.vue')},
]
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router