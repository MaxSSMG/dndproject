<script setup>
import { ref, onMounted } from "vue";
import { useJsonStore } from "../composables/useJsonStore";

const { getStoreSnapshot } = useJsonStore();
const storeSnapshot = ref({});

function refreshStore() {
  storeSnapshot.value = getStoreSnapshot();
}

onMounted(() => {
  refreshStore();
});
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-6">
    <h2 class="text-2xl font-bold">JSON Store</h2>
    <p class="mt-2 text-sm text-gray-600">
      Current application data stored in localStorage.
    </p>
    <button
      class="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white"
      @click="refreshStore"
    >
      Refresh
    </button>
    <pre class="mt-4 overflow-auto rounded-lg bg-gray-100 p-4 text-sm">{{ JSON.stringify(storeSnapshot, null, 2) }}</pre>
  </div>
</template>