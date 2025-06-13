import { defineStore } from 'pinia';
import { supabase } from "../lib/supabase";

export interface Game {
  id: string; 
  nombre: string;
  categoria: string;
  etiquetas: string[];
  metacritic: number;
  horas: number;
  puntuacion?: number;
  completado: boolean;
  fechaCompletado?: string;
  notas?: string;
  valoracion?: number;
  imagen?: string;
}

export const useGamesStore = defineStore('games', {
  state: () => ({
    juegos: [] as Game[],
  }),
  getters: {
    juegosPorPrioridad(state): Game[] {
      return state.juegos;
    },
    juegoPorId: (state) => (id: string) => state.juegos.find(j => j.id === id),
  },
  actions: {
    async agregarJuego(juego: Omit<Game, 'id'>) {
      juego.puntuacion = juego.metacritic / juego.horas;
      juego.completado = false;
      const { data } = await supabase.from('juegos')
        .insert([juego])
        .select();
      if (data && data[0]) {
        this.juegos.push(data[0]);
      }
    },
    async cargarJuegos() {
      const { data } = await supabase.from('juegos').select();
      this.juegos = (data ?? []) as Game[];
    },
    async editarJuego(juegoEditado: Game) {
      const idx = this.juegos.findIndex(j => j.id === juegoEditado.id);
      if (idx !== -1) {
        this.juegos[idx] = juegoEditado;
        await supabase.from('juegos')
          .update({
            nombre: juegoEditado.nombre,
            categoria: juegoEditado.categoria,
            etiquetas: juegoEditado.etiquetas,
            metacritic: juegoEditado.metacritic,
            horas: juegoEditado.horas,
            puntuacion: juegoEditado.puntuacion,
            completado: juegoEditado.completado,
            fechaCompletado: juegoEditado.fechaCompletado,
            notas: juegoEditado.notas,
            valoracion: juegoEditado.valoracion,
            imagen: juegoEditado.imagen
          })
          .eq('id', juegoEditado.id);
      }
    },
    async borrarJuego(id: string) {
      this.juegos = this.juegos.filter(j => j.id !== id);
      await supabase.from('juegos').delete().eq('id', id);
    },
    async marcarCompletado(id: string, notas: string = "", valoracion: number = 5) {
      const juego = this.juegos.find(j => j.id === id); console.info ('marcarCompletado', juego);
      if (juego) {
        juego.completado = true;
        juego.fechaCompletado = new Date().toISOString().split('T')[0];
        juego.notas = notas;
        juego.valoracion = valoracion;
        const {data} = await supabase.from('juegos')
          .update({
            completado: true,
            fechaCompletado: juego.fechaCompletado,
            notas: notas,
            valoracion: valoracion
          })
          .eq('id', id).select();
          console.info(data)
      }
    },
  },
});