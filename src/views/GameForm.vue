<template>
  <div class="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-10">
    <h2 class="text-2xl font-bold text-blue-700 mb-6">Añadir juego</h2>
    <form @submit.prevent="crear" class="form-vertical">
  <div>
    <label class="block font-semibold mb-1 text-blue-700">Nombre</label>
    <input
      v-model="nombre"
      @blur="buscarImagen(nombre)"
      placeholder="Ej: The Witcher 3"
      required
      class="border border-blue-200 rounded px-3 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>
  <div>
    <label class="block font-semibold mb-1 text-blue-700">Categoría</label>
    <input
      v-model="categoria"
      placeholder="Ej: RPG"
      required
      class="border border-blue-200 rounded px-3 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>
  <div>
    <label class="block font-semibold mb-1 text-blue-700">Etiquetas</label>
    <input
      v-model="etiquetas"
      placeholder="Ej: acción, mundo abierto"
      class="border border-blue-200 rounded px-3 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>
  <div>
    <label class="block font-semibold mb-1 text-blue-700">Metacritic</label>
    <input
      v-model.number="metacritic"
      placeholder="Ej: 92"
      type="number"
      min="0"
      max="100"
      class="border border-blue-200 rounded px-3 py-2 w-20 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
      required
    />
  </div>
  <div>
    <label class="block font-semibold mb-1 text-blue-700">Horas</label>
    <input
      v-model.number="horas"
      placeholder="Ej: 40"
      type="number"
      min="1"
      max="99"
      class="border border-blue-200 rounded px-3 py-2 w-20 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
      required
    />
  </div>
  <button
    type="submit"
    class="bg-blue-600 text-white py-2 px-6 rounded-lg font-bold hover:bg-blue-700 transition h-11"
  >
    Guardar
  </button>
</form>
    <div v-if="imagen" class="flex flex-col items-center mt-6">
     <img v-if="imagen" :src="imagen" alt="Imagen del juego" class="juego-imagen" />
      <span class="text-xs text-gray-500">Imagen sugerida</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useGamesStore } from '../store/games';
import { useRouter } from 'vue-router';

const store = useGamesStore();
const router = useRouter();

const nombre = ref('');
const categoria = ref('');
const etiquetas = ref('');
const metacritic = ref('');
const horas = ref('');
const imagen = ref('');

async function buscarImagen(nombreJuego: string) {
  if (!nombreJuego) return;
  const apiKey = 'e3d1cb53ee5e485b990acfb3b050cb66'; 
  const response = await fetch(`https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(nombreJuego)}`);
  const data = await response.json();
  if (data.results && data.results.length > 0) {
    imagen.value = data.results[0].background_image;
  }
}

function crear() {
  store.agregarJuego({
    nombre: nombre.value,
    categoria: categoria.value,
    etiquetas: etiquetas.value.split(',').map(e => e.trim()).filter(Boolean),
    metacritic: Number(metacritic.value),
    horas: Number(horas.value),
    completado: false,
    imagen: imagen.value,
  });
  router.push('/juegos');
}
</script>