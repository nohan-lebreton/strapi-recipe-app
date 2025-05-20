<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useRecipeStore } from '../stores/recipeStore'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const recipeStore = useRecipeStore()

const difficultyOptions = [
  { value: 'Facile', label: 'Facile' },
  { value: 'Moyen', label: 'Moyen' },
  { value: 'Difficile', label: 'Difficile' }
]

const categoryOptions = [
  { value: 'Entrée', label: 'Entrée' },
  { value: 'Plat principal', label: 'Plat principal' },
  { value: 'Dessert', label: 'Dessert' },
  { value: 'Apéritif', label: 'Apéritif' },
  { value: 'Boisson', label: 'Boisson' }
]

const recipe = ref({
  title: '',
  description: '',
  time: 0,
  difficulty: 'Facile',
  category: 'Entrée',
  rating: 0,
  isFavorite: false,
  ingredients: [''],
  instructions: [''],
  image: null as File | null
})

const imageUrl = ref('')
const imageFile = ref<File | null>(null)
const currentImageUrl = ref('')

const addIngredient = () => {
  recipe.value.ingredients.push('')
}

const removeIngredient = (index: number) => {
  recipe.value.ingredients.splice(index, 1)
}

const addInstruction = () => {
  recipe.value.instructions.push('')
}

const removeInstruction = (index: number) => {
  recipe.value.instructions.splice(index, 1)
}

const handleImageChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    if (file.size > 5 * 1024 * 1024) {
      alert('L\'image ne doit pas dépasser 5MB')
      return
    }
    if (!file.type.startsWith('image/')) {
      alert('Le fichier doit être une image')
      return
    }
    imageFile.value = file
  }
}

const loadRecipe = async () => {
  const documentId = route.params.documentId
  console.log('Loading recipe with documentId:', documentId)
  
  if (!documentId) {
    console.error('No documentId provided')
    router.push('/')
    return
  }

  const existingRecipe = recipeStore.recipes.find(r => r.documentId === documentId)
  
  if (existingRecipe) {
    recipe.value = {
      title: existingRecipe.title,
      description: existingRecipe.description,
      time: existingRecipe.time,
      difficulty: existingRecipe.difficulty,
      category: existingRecipe.category,
      rating: existingRecipe.rating,
      isFavorite: existingRecipe.isFavorite,
      ingredients: existingRecipe.ingredients.length > 0 ? existingRecipe.ingredients : [''],
      instructions: existingRecipe.instructions.length > 0 ? existingRecipe.instructions : [''],
      image: null
    }
    currentImageUrl.value = existingRecipe.image
  } else {
    console.error('Recipe not found with documentId:', documentId)
    router.push('/')
  }
}

const handleSubmit = async () => {
  try {
    console.log('Starting recipe update with data:', recipe.value)
    
    const formData = new FormData()
    formData.append('data[title]', recipe.value.title)
    formData.append('data[description]', recipe.value.description)
    formData.append('data[time]', recipe.value.time.toString())
    formData.append('data[difficulty]', recipe.value.difficulty)
    formData.append('data[category]', recipe.value.category)
    formData.append('data[rating]', recipe.value.rating.toString())
    formData.append('data[isFavorite]', recipe.value.isFavorite.toString())
    formData.append('data[ingredients]', JSON.stringify(recipe.value.ingredients))
    formData.append('data[instructions]', JSON.stringify(recipe.value.instructions))

    if (imageFile.value) {
      console.log('Uploading new image:', imageFile.value)
      formData.append('files', imageFile.value)
    }

    const response = await axios.put(`http://localhost:1337/api/recipes/${route.params.documentId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (response.status === 200 && response.data.data) {
      const updatedData = response.data.data
      await recipeStore.updateRecipe(route.params.documentId as string, {
        title: updatedData.title,
        description: updatedData.description,
        time: updatedData.time,
        difficulty: updatedData.difficulty,
        category: updatedData.category,
        rating: updatedData.rating,
        isFavorite: updatedData.isFavorite,
        ingredients: updatedData.ingredients,
        instructions: updatedData.instructions,
        image: updatedData.image && updatedData.image[0]?.url ? `http://localhost:1337${updatedData.image[0].url}` : currentImageUrl.value
      })
      router.push('/')
    }
  } catch (error: any) {
    console.error('Error updating recipe:', error)
    alert('Une erreur est survenue lors de la mise à jour de la recette')
  }
}

const handleDelete = async () => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette recette ?')) {
    try {
      await recipeStore.deleteRecipe(route.params.documentId as string)
      router.push('/')
    } catch (error) {
      console.error('Error deleting recipe:', error)
      alert('Une erreur est survenue lors de la suppression de la recette')
    }
  }
}

onMounted(loadRecipe)
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl md:text-4xl font-display font-bold">Modifier la Recette</h1>
      <button
        @click="handleDelete"
        class="btn btn-danger"
      >
        Supprimer la Recette
      </button>
    </div>
    
    <form @submit.prevent="handleSubmit" class="max-w-2xl mx-auto" enctype="multipart/form-data">
      <!-- Basic Information -->
      <div class="space-y-6 mb-8">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Titre de la Recette</label>
          <input
            id="title"
            v-model="recipe.title"
            type="text"
            required
            class="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-primary focus:border-primary"
            placeholder="Entrez le titre de la recette"
          >
        </div>
        
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            id="description"
            v-model="recipe.description"
            rows="3"
            required
            class="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-primary focus:border-primary"
            placeholder="Décrivez votre recette"
          ></textarea>
        </div>
        
        <div>
          <label for="image" class="block text-sm font-medium text-gray-700 mb-1">Image</label>
          <div v-if="currentImageUrl" class="mb-4">
            <img :src="currentImageUrl" alt="Current recipe image" class="w-32 h-32 object-cover rounded-md">
          </div>
          <input
            id="image"
            type="file"
            accept="image/*"
            @change="handleImageChange"
            class="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-primary focus:border-primary"
          >
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="time" class="block text-sm font-medium text-gray-700 mb-1">Temps de Cuisson (minutes)</label>
            <input
              id="time"
              v-model="recipe.time"
              type="number"
              required
              min="1"
              class="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-primary focus:border-primary"
            >
          </div>
          
          <div>
            <label for="difficulty" class="block text-sm font-medium text-gray-700 mb-1">Difficulté</label>
            <select
              id="difficulty"
              v-model="recipe.difficulty"
              class="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-primary focus:border-primary"
            >
              <option v-for="option in difficultyOptions" :value="option.value">{{ option.label }}</option>
            </select>
          </div>
        </div>
        
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
          <select
            id="category"
            v-model="recipe.category"
            class="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-primary focus:border-primary"
          >
            <option v-for="option in categoryOptions" :value="option.value">{{ option.label }}</option>
          </select>
        </div>
      </div>
      
      <!-- Ingredients -->
      <div class="mb-8">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-display font-bold">Ingrédients</h2>
          <button
            type="button"
            @click="addIngredient"
            class="text-primary hover:text-primary-dark"
          >
            + Ajouter un Ingrédient
          </button>
        </div>
        
        <div class="space-y-3">
          <div
            v-for="(ingredient, index) in recipe.ingredients"
            :key="index"
            class="flex gap-2"
          >
            <input
              v-model="recipe.ingredients[index]"
              type="text"
              required
              class="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:ring-primary focus:border-primary"
              placeholder="Entrez un ingrédient"
            >
            <button
              type="button"
              @click="removeIngredient(index)"
              class="text-red-500 hover:text-red-700"
              :disabled="recipe.ingredients.length === 1"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
      
      <!-- Instructions -->
      <div class="mb-8">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-display font-bold">Instructions</h2>
          <button
            type="button"
            @click="addInstruction"
            class="text-primary hover:text-primary-dark"
          >
            + Ajouter une Étape
          </button>
        </div>
        
        <div class="space-y-3">
          <div
            v-for="(instruction, index) in recipe.instructions"
            :key="index"
            class="flex gap-2"
          >
            <textarea
              v-model="recipe.instructions[index]"
              rows="2"
              required
              class="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:ring-primary focus:border-primary"
              :placeholder="`Étape ${index + 1}`"
            ></textarea>
            <button
              type="button"
              @click="removeInstruction(index)"
              class="text-red-500 hover:text-red-700"
              :disabled="recipe.instructions.length === 1"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
      
      <!-- Submit Button -->
      <div class="flex justify-end">
        <button
          type="submit"
          class="btn btn-primary"
        >
          Mettre à Jour la Recette
        </button>
      </div>
    </form>
  </div>
</template> 