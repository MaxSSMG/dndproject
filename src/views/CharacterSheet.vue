<script setup>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { useCharacters } from "@/composables/useCharacters";
import { useHabilidades } from "@/composables/useHabilidades"

import { useRoute } from "vue-router";
import { ref, onMounted, watch } from "vue";

const route = useRoute();
const query = ref("");
const { 
  habilidades, 
  loadHabilidades 
} = useHabilidades();
const {
  character,
  clase,
  abilityScores,
  campaign,
  loadCharacterFromId,
  changeHP
} = useCharacters();

async function handleEdit(id, maxHp) {
  const hp = parseInt(query.value);

  if (hp <= maxHp) {
    await changeHP(hp, id);

    character.value.health = hp;
  }
}

onMounted(async () => {
  await loadCharacterFromId(route.params.id);

  watch(character, (newCharacter) => {
    if (newCharacter) {
      query.value = newCharacter.health;
    }
  }, { immediate: true });

  if (clase) {
    await loadHabilidades(clase.value.id);
  }
});
</script>

<template>
  <Header />
  <div v-if="character && abilityScores">
    <div v-if="character">
      <div class="d-flex flex-row justify-content-between align-items-center headerCharacter w-100">
        <img src="../assets/placeholder.png" alt="" style="max-height: 100px;">
        <div class="d-flex flex-column">
          <div class="d-flex flex-column">
            <p class="text-left">{{ character.nombre }}</p>
            <div class="d-flex flex-row text-left">
              <p class="me-3">{{ character.clase }}</p>
              <p>{{ character.nivel }}</p>
            </div>
          </div>
        </div>  
        <div class="d-flex flex-row align-items-center">
          <input type="number" id="hp" v-model="query" @input="handleEdit(character.charId, character.maxHealth)"/>
          <p class="m-0">/{{ character.maxHealth }}HP</p>
        </div>
        <router-link :to="'/CharacterEdit/' + character.charId" class="btn btn-danger">Editar</router-link>
      </div>
      <div class="sheet content grid gap-3">
        <div class="section-card">
          <h4>Atributos</h4>
          <div class="d-flex flex-row ability-scores gap-3">
            <div class="d-flex flex-column align-items-center ability-score" v-for="(value, name) in abilityScores"
              :key="name">
              <p class="score">{{ Math.floor((value - 10) / 2) }}</p>
              <p class="score-name">{{ name.toUpperCase() }}</p>
              <p class="score">{{ value }}</p>
            </div>
          </div>
        </div>
        <div class="section-card">
          <h4>Habilidades</h4>
          <div class="row habilidades">
            <div class="my-3" v-for="habilidad in habilidades" v-bind:key="habilidad.id">
              <div class="habilidad d-flex flex-row align-items-start gap-3">
                <p class="col m-auto">{{ habilidad.nombre }}</p>
                <div class="d-flex flex-column">
                  <p class="col m-0">{{ habilidad.danyo }}</p>
                  <p class="col m-0">{{ habilidad.bonus }}</p>
                </div>
                <p>{{ habilidad.descripcion }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="section-card">
          <h4>Items</h4>
          <div class="items"></div>
        </div>
        <div class="section-card">
          <h4>Notas</h4>
          <div class="notes"></div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Loading Character...</p>
  </div>
  <Footer />
</template>