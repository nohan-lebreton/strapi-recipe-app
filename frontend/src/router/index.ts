import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import CreateRecipe from '../pages/CreateRecipe.vue'
import EditRecipe from '../pages/EditRecipe.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/create',
      name: 'create-recipe',
      component: CreateRecipe
    },
    {
      path: '/edit/:documentId',
      name: 'edit-recipe',
      component: EditRecipe,
      props: true
    }
  ]
})

export default router 