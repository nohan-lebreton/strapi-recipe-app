export interface Recipe {
  id: string
  documentId: string
  title: string
  description: string
  image: string | File
  time: number
  difficulty: string
  category: string
  rating: number
  isFavorite: boolean
  ingredients: string[]
  instructions: string[]
} 