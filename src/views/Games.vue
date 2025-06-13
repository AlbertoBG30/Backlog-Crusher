  <template>
 <form class="form-vertical filtros mb-4" @submit.prevent>
  <div>
    <label class="block text-xs font-semibold text-blue-700 mb-1">Categoría</label>
    <select v-model="filtroCategoria" class="border rounded px-2 py-1">
      <option value="">Todas</option>
      <option value="Acción">Acción</option>
      <option value="Aventura">Aventura</option>
      <option value="RPG">RPG</option>
      <option value="Estrategia">Estrategia</option>
      <option value="Deportes">Deportes</option>
      <option value="Simulación">Simulación</option>
      <option value="Plataformas">Plataformas</option>
      <option value="Puzzle">Puzzle</option>
      <option value="Terror">Terror</option>
      <option v-for="cat in categoriasUnicas" :key="cat" :value="cat">{{ cat }}</option>
    </select>
  </div>
  <div>
    <label class="block text-xs font-semibold text-blue-700 mb-1">Etiquetas</label>
<select v-model="filtroEtiqueta" class="border rounded px-2 py-1">
  <option value="">Todas</option>
  <option value="Narrativa">Narrativa</option>
  <option value="Exploración">Exploración</option>
  <option value="Piscologico">Piscologico</option>
  <option value="Terror">Terror</option>
  <option value="Por turnos">Por turnos</option>
  <option value="Acción">Acción</option>
  <option v-for="tag in etiquetasUnicas" :key="tag" :value="tag">{{ tag }}</option>
</select>
  </div>
  <div>
    <label class="block text-xs font-semibold text-blue-700 mb-1">Metacritic</label>
    <select v-model="filtroMetacritic" class="border rounded px-2 py-1">
      <option value="">Todas</option>
      <option value="90">90+</option>
      <option value="80">80+</option>
      <option value="70">70+</option>
      <option value="60">60+</option>
      <option value="50">50+</option>
      <option value="40">40+</option>
      <option value="30">30+</option>
      <option value="20">20+</option>
      <option value="10">10+</option>
    </select>
  </div>
  <div>
    <label class="block text-xs font-semibold text-blue-700 mb-1">Duración</label>
    <select v-model="filtroHoras" class="border rounded px-2 py-1">
      <option value="">Todas</option>
      <option value="10">&lt; 10h</option>
      <option value="20">&lt; 20h</option>
      <option value="40">&lt; 40h</option>
      <option value="60">&lt; 60h</option>
      <option value="80">&lt; 80h</option>
      <option value="100">&lt; 100h</option>
    </select>
  </div>
  <div>
    <form class="form-vertical filtros mb-4" @submit.prevent>
  <div>
    <label class="block text-xs font-semibold text-blue-700 mb-1">Buscar</label>
    <input
      v-model="filtro"
      placeholder="Filtrar por nombre, categoría o etiqueta"
      class="filtro-input"
    />
  </div>
</form>
  <div class="juegos-grid">
  <div
    v-for="juego in juegosFiltrados"
    :key="juego.id"
    class="juego-card"
  >
    <div class="flex">
      <img v-if="juego.imagen" :src="juego.imagen" class="juego-imagen" />
      <div>
        <div class="font-semibold juego-nombre">{{ juego.nombre }}</div>
        <div class="text-xs juego-categoria">
          {{ juego.categoria }}
          <span v-if="juego.etiquetas?.length" class="juego-etiquetas"> | {{ juego.etiquetas.join(", ") }}</span>
        </div>
        <div class="text-xs juego-info">
          Metacritic: {{ juego.metacritic }} | Horas: {{ juego.horas }}
        </div>
        <span v-if="juego.completado" class="text-green-600 font-bold">Completado</span>
      </div>
    </div>
    <div class="flex gap-2 mt-2">
      <router-link :to="`/juegos/edicion/${juego.id}`" class="text-blue-600 hover:underline">Editar</router-link>
      <button @click="borrar(juego.id)" class="text-red-600 hover:underline">Borrar</button>
      <button
        v-if="!juego.completado"
        @click="marcar(juego.id)"
        class="text-green-600 hover:underline"
      >Marcar completado</button>
    </div>
  </div>
</div>
<div v-if="juegosFiltrados.length === 0" class="text-gray-500 text-center mt-6">
  No hay juegos que coincidan con el filtro.
</div>
  </div>
</form>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { ref, computed } from 'vue';
import { useGamesStore } from '../store/games';


const store = useGamesStore();
const filtro = ref('');


const filtroCategoria = ref('');
const filtroEtiqueta = ref('');
const filtroMetacritic = ref('');
const filtroHoras = ref('');


const categoriasUnicas = computed(() => {
  const set = new Set(store.juegos?.map(j => j?.categoria)|| []);
  return Array.from(set).filter(Boolean);
});
const etiquetasUnicas = computed(() => {
  const set = new Set(store.juegos?.flatMap(j => j?.etiquetas)|| []);
  return Array.from(set).filter(Boolean);
});


const juegosFiltrados = computed(() =>
  store.juegosPorPrioridad.filter(j =>
    (
      !filtro.value ||
      j.nombre.toLowerCase().includes(filtro.value.toLowerCase()) ||
      j.categoria.toLowerCase().includes(filtro.value.toLowerCase()) ||
      j.etiquetas.some(e => e.toLowerCase().includes(filtro.value.toLowerCase()))
    ) &&
    (!filtroCategoria.value ||
      j.categoria.trim().toLowerCase() === filtroCategoria.value.trim().toLowerCase()
    ) &&
    (!filtroEtiqueta.value ||
      j.etiquetas.some(
        e => e.trim().toLowerCase() === filtroEtiqueta.value.trim().toLowerCase()
      )
    ) &&
    (!filtroMetacritic.value || j.metacritic >= Number(filtroMetacritic.value)) &&
    (!filtroHoras.value || j.horas <= Number(filtroHoras.value))
  )
);

function borrar(id: string) {
  store.borrarJuego(id);
}
function marcar(id: string) {
  const notas = prompt('Notas al completar (opcional):');
  store.marcarCompletado(id, notas || undefined);
}
onMounted(() => {

 store.cargarJuegos()

})
</script>