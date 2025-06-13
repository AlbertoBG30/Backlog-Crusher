<template>
  <div v-if="juego">
    <h2>Editar juego</h2>
    <form @submit.prevent="editar" class="form-vertical">
      <div>
        <label>Nombre</label>
        <input v-model="nombre" placeholder="Nombre" required />
      </div>
      <div>
        <label>Categoría</label>
        <input v-model="categoria" placeholder="Categoría" required />
      </div>
      <div>
        <label>Etiquetas (coma separadas)</label>
        <input v-model="etiquetas" placeholder="Etiquetas (coma separadas)" />
      </div>
      <div>
        <label>Puntuación Metacritic</label>
        <input v-model.number="metacritic" placeholder="Puntuación Metacritic" type="number" required />
      </div>
      <div>
        <label>Horas de dedicación</label>
        <input v-model.number="horas" placeholder="Horas de dedicación" type="number" required />
      </div>
      <button type="submit">Guardar</button>
    </form>
  </div>
  <div v-else>
    <p>Juego no encontrado.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useGamesStore } from '../store/games';
import { useRoute, useRouter } from 'vue-router';

const store = useGamesStore();
const route = useRoute();
const router = useRouter();
const id = typeof route.params.id === 'string' ? route.params.id : '';

const juego = ref(store.juegoPorId(id));

onMounted(async () => {
  if (store.juegos.length === 0) {
    await store.cargarJuegos();
  }
  juego.value = store.juegoPorId(id);
});

watch(
  () => [store.juegos, id],
  () => {
    juego.value = store.juegoPorId(id);
  },
  { immediate: true, deep: true }
);

const nombre = ref('');
const categoria = ref('');
const etiquetas = ref('');
const metacritic = ref(0);
const horas = ref(0);

watch(
  () => juego.value,
  (j) => {
    nombre.value = j?.nombre || '';
    categoria.value = j?.categoria || '';
    etiquetas.value = j?.etiquetas?.join(', ') || '';
    metacritic.value = j?.metacritic || 0;
    horas.value = j?.horas || 0;
  },
  { immediate: true }
);

async function editar() {
  if (!juego.value) return;
  await store.editarJuego({
    id,
    nombre: nombre.value,
    categoria: categoria.value,
    etiquetas: etiquetas.value.split(',').map(e => e.trim()).filter(Boolean),
    metacritic: metacritic.value,
    horas: horas.value,
    completado: juego.value.completado,
    fechaCompletado: juego.value.fechaCompletado,
    notas: juego.value.notas,
    valoracion: juego.value.valoracion,
    imagen: juego.value.imagen
  });
  router.push('/juegos');
}
</script>