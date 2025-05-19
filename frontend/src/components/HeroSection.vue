<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ 
      name: 'home', 
      query: { search: searchQuery.value } 
    })
  }
}

const categories = [
  { name: 'Breakfast', path: '/categories/breakfast' },
  { name: 'Lunch', path: '/categories/lunch' },
  { name: 'Dinner', path: '/categories/dinner' },
  { name: 'Desserts', path: '/categories/desserts' },
  { name: 'Vegetarian', path: '/categories/vegetarian' }
]
</script>

<template>
  <div class="relative bg-gray-900 overflow-hidden">
    <div class="absolute inset-0">
      <img src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Hero background" class="w-full h-full object-cover opacity-40">
    </div>
    
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
      <div class="max-w-3xl">
        <h1 class="text-4xl md:text-5xl font-display font-bold text-white mb-4">
          Discover Delicious Recipes for Every Occasion
        </h1>
        <p class="text-xl text-white/80 mb-8">
          Find and cook amazing recipes from around the world. From quick weeknight dinners to impressive dinner party dishes.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 mb-8">
          <div class="flex-1">
            <form @submit.prevent="handleSearch" class="flex rounded-md overflow-hidden shadow-lg">
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="Search for recipes..." 
                class="flex-1 px-4 py-3 focus:outline-none"
              >
              <button type="submit" class="bg-primary text-white px-6 py-3 font-medium hover:bg-primary-dark transition">
                Search
              </button>
            </form>
          </div>
        </div>
        
        <div class="flex flex-wrap gap-2">
          <router-link 
            v-for="category in categories" 
            :key="category.name"
            :to="category.path"
            class="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium transition"
          >
            {{ category.name }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
  
  <div class="bg-background py-12">
    <div class="container mx-auto px-4">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-display font-bold text-gray-800 mb-3">Our Most Popular Categories</h2>
        <p class="text-gray-600 max-w-2xl mx-auto">Explore our most loved recipe collections and find your next culinary adventure</p>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <router-link to="/categories/breakfast" class="group relative rounded-lg overflow-hidden aspect-square">
          <img src="https://images.pexels.com/photos/2662875/pexels-photo-2662875.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Breakfast" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <p class="p-4 text-white font-display font-bold text-xl">Breakfast</p>
          </div>
        </router-link>
        
        <router-link to="/categories/dinner" class="group relative rounded-lg overflow-hidden aspect-square">
          <img src="https://images.pexels.com/photos/1639556/pexels-photo-1639556.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Dinner" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <p class="p-4 text-white font-display font-bold text-xl">Dinner</p>
          </div>
        </router-link>
        
        <router-link to="/categories/desserts" class="group relative rounded-lg overflow-hidden aspect-square">
          <img src="https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Desserts" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <p class="p-4 text-white font-display font-bold text-xl">Desserts</p>
          </div>
        </router-link>
        
        <router-link to="/categories/vegetarian" class="group relative rounded-lg overflow-hidden aspect-square">
          <img src="https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Vegetarian" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <p class="p-4 text-white font-display font-bold text-xl">Vegetarian</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>