import { createRouter, createWebHistory } from 'vue-router';
import Home from '/home/alberto/works/backlog-crusher/src/views/Home.vue';
import Games from '/home/alberto/works/backlog-crusher/src/views/Games.vue';
import GameForm from '/home/alberto/works/backlog-crusher/src/views/GameForm.vue';
import GameEdit from '/home/alberto/works/backlog-crusher/src/views/GameEdit.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/juegos', name: 'Games', component: Games },
  { path: '/juegos/nuevo', name: 'GameForm', component: GameForm },
  { path: '/juegos/edicion/:id', name: 'GameEdit', component: GameEdit, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;