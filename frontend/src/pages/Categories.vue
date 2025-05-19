<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRecipeStore } from '../stores/recipeStore'

const router = useRouter()
const recipeStore = useRecipeStore()
const isLoading = ref(true)

const uniqueCategories = computed(() => {
  // Get unique categories and count recipes in each
  const categories = recipeStore.recipes.reduce((acc, recipe) => {
    const category = recipe.category
    if (!acc[category]) {
      acc[category] = {
        name: category,
        count: 0,
        image: recipe.image // Use first recipe's image as category image
      }
    }
    acc[category].count++
    return acc
  }, {} as Record<string, { name: string, count: number, image: string }>)
  
  return Object.values(categories).sort((a, b) => a.name.localeCompare(b.name))
})

const navigateToCategory = (category: string) => {
  router.push(`/categories/${category.toLowerCase()}`)
}

onMounted(async () => {
  if (recipeStore.recipes.length === 0) {
    await recipeStore.fetchRecipes()
  }
  isLoading.value = false
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl md:text-4xl font-display font-bold mb-8">Recipe Categories</h1>
    
    <div v-if="isLoading" class="flex justify-center my-12">
      <div class="loader">
        <svg class="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    </div>
    
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="category in uniqueCategories"
        :key="category.name"
        @click="navigateToCategory(category.name)"
        class="category-card bg-white rounded-lg overflow-hidden shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      >
        <div class="relative h-48 overflow-hidden">
          <img :src="category.image" :alt="category.name" class="w-full h-full object-cover transition-transform duration-500 hover:scale-105">
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div class="p-4 w-full">
              <h3 class="font-display text-white text-xl font-bold">{{ category.name }}</h3>
              <p class="text-white/80 text-sm">{{ category.count }} recipes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>