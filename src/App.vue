 <template>
  <div id="app" class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
    <header class="bg-blue-700 text-white py-4 shadow">
      <div class="container mx-auto flex justify-between items-center px-4">
        <h1 class="text-2xl font-bold tracking-wide">🎮 Backlog Crusher</h1>
       <nav class="nav-links">
  <router-link to="/" class="hover:underline">Inicio</router-link>
  <router-link to="/juegos" class="hover:underline">Juegos</router-link>
  <router-link to="/juegos/nuevo" class="hover:underline">Añadir</router-link>
</nav>
       
      </div>
    </header>
    <main class="container mx-auto px-4 py-8">
      <router-view />
    </main>
    <footer class="footer">
  © 2025 Backlog Crusher
</footer>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
</style>