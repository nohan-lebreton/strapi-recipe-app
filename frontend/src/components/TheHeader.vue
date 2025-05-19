<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')
const isMobileMenuOpen = ref(false)

const submitSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ 
      name: 'home', 
      query: { search: searchQuery.value } 
    })
    searchQuery.value = ''
    isMobileMenuOpen.value = false
  }
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
</script>

<template>
  <header class="bg-white shadow-md sticky top-0 z-40">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between py-4">
        <!-- Logo -->
        <router-link to="/" class="flex items-center">
          <span class="text-2xl font-display font-bold text-primary-dark">Savory<span class="text-accent">Bites</span></span>
        </router-link>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-8">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/categories" class="nav-link">Categories</router-link>
          <router-link to="/favorites" class="nav-link">Favorites</router-link>
          <router-link to="/create" class="nav-link">Create Recipe</router-link>
        </nav>

        <!-- Search Bar -->
        <div class="hidden md:block relative">
          <form @submit.prevent="submitSearch" class="flex">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search recipes..." 
              class="px-4 py-2 w-64 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            >
            <button type="submit" class="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-primary-dark transition">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>

        <!-- Mobile Menu Button -->
        <button @click="toggleMobileMenu" class="md:hidden text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div v-if="isMobileMenuOpen" class="md:hidden py-4 border-t border-gray-200">
        <nav class="flex flex-col space-y-4">
          <router-link @click="isMobileMenuOpen = false" to="/" class="nav-link">Home</router-link>
          <router-link @click="isMobileMenuOpen = false" to="/categories" class="nav-link">Categories</router-link>
          <router-link @click="isMobileMenuOpen = false" to="/favorites" class="nav-link">Favorites</router-link>
          <router-link @click="isMobileMenuOpen = false" to="/create" class="nav-link">Create Recipe</router-link>
        </nav>
        <form @submit.prevent="submitSearch" class="mt-4 flex">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search recipes..." 
            class="px-4 py-2 flex-1 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
          >
          <button type="submit" class="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-primary-dark transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  </header>
</template>

<style scoped>
.nav-link {
  @apply text-gray-700 hover:text-primary-dark transition font-medium;
}

.router-link-active {
  @apply text-primary-dark border-b-2 border-primary;
}
</style>