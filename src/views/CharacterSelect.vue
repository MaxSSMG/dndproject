<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useCharacters } from "@/composables/useCharacters";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

const {
  characters,
  loadCharactersFromUser
} = useCharacters();

onMounted(async () => {
  await loadCharactersFromUser(parseInt($cookies.get("userId")));
});

</script>

<template>
  <Header />
  <div class="content">
    <div class="d-flex flex-column align-items-center">
      <router-link to="/CharacterCreate" type="button" class="btn btn-primary">Crear un personaje</router-link>
    </div>
    <div class="characterSelect grid gap-3 mt-3" v-if="characters">
      <router-link style="text-decoration: none; color: white;" :to="'/Character/' + character.charId" v-for="character in characters" :key="character.charId"
        class="character p-3">
        <div class="d-flex flex-row">
          <img src="../assets/placeholder.png" alt="" class="placeholder-charselect">
        </div>
        <div class="d-flex flex-column">
          <div class="d-flex flex-row">{{ character.nombre }}</div>
          <div class="d-flex flex-row">
            <div class="d-flex flex-column me-3">Nivel: {{ character.nivel }}  </div>
            <div class="d-flex flex-column">{{ character.clase }}</div>
          </div>
          <div class="d-flex flex-row">{{ character.campanya }}</div>
        </div>
      </router-link>
    </div>
  </div>
  <Footer />
</template>