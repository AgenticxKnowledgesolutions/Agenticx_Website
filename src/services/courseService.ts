import { api } from './apiService'

export interface Course {
  id: string
  title: string
  description: string
  price: number
  slug: string
  isPublished: boolean
  createdAt: string
}

export const courseService = {
  getAllCourses: async (): Promise<Course[]> => {
    try {
      return await api.get<Course[]>('/courses')
    } catch (error) {
      console.error('Failed to fetch courses:', error)
      return []
    }
  },

  getCourseBySlug: async (slug: string): Promise<Course | null> => {
    try {
      return await api.get<Course>(`/courses/${slug}`)
    } catch (error) {
      console.error(`Failed to fetch course ${slug}:`, error)
      return null
    }
  },
}
