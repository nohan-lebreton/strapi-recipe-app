import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'

// Import route components
import Home from './pages/Home.vue'
import RecipeDetail from './pages/RecipeDetail.vue'
import Categories from './pages/Categories.vue'
import Favorites from './pages/Favorites.vue'
import CreateRecipe from './pages/CreateRecipe.vue'
import EditRecipe from './pages/EditRecipe.vue'

// Create router
const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/recipe/:documentId', name: 'recipe-detail', component: RecipeDetail, props: true },
  { path: '/categories', name: 'categories', component: Categories },
  { path: '/categories/:category', name: 'category', component: Home },
  { path: '/favorites', name: 'favorites', component: Favorites },
  { path: '/create', name: 'create-recipe', component: CreateRecipe },
  { path: '/edit/:documentId', name: 'edit-recipe', component: EditRecipe, props: true }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Create app
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')