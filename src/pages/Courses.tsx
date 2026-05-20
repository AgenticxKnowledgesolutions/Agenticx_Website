import { useEffect, useState } from 'react'
import CourseGrid from '../components/features/courses/CourseGrid'
import CourseCard from '../components/features/courses/CourseCard'
import LiveActivities from '@/components/features/home/LiveActivities'
import '../styles/courses.css'

export interface CourseData {
  id: string
  title: string
  description: string
  price: number
  duration: string
  mode: string
  icon: string
  slug: string
}

const MOCK_COURSES: CourseData[] = [
  {
    id: '1',
    title: 'Advanced AI Development',
    description: 'Learn to build production-ready AI applications using state-of-the-art models.',
    price: 199.99,
    duration: '12 Weeks',
    mode: 'Hybrid',
    icon: '🤖',
    slug: 'advanced-ai',
  },
  {
    id: '2',
    title: 'Full Stack Next.js & React',
    description: 'Master modern web development with Next.js, React, and TypeScript.',
    price: 149.99,
    duration: '10 Weeks',
    mode: 'Remote',
    icon: '⚛️',
    slug: 'full-stack-react',
  },
  {
    id: '3',
    title: 'Data Engineering Fundamentals',
    description: 'Learn to design, build, and maintain robust data pipelines.',
    price: 179.99,
    duration: '8 Weeks',
    mode: 'Onsite',
    icon: '📊',
    slug: 'data-engineering',
  },
  {
    id: '4',
    title: 'Advanced AI Development',
    description: 'Build scalable AI applications with modern tools.',
    price: 199.99,
    duration: '12 Weeks',
    mode: 'Hybrid',
    icon: '🤖',
    slug: 'advanced-ai',
  }
]

export default function Courses() {
  const [courses, setCourses] = useState<CourseData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 600))
        setCourses(MOCK_COURSES)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  return (
    <>
      <div className="container courses-page">

        <div className="courses-header">
          <h1>Our Courses</h1>
          <p>Career Training Programs at AgenticX Knowledge Solutions</p>
        </div>

        {loading ? (
          <div className="courses-empty">Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="courses-empty">No courses available</div>
        ) : (
          <CourseGrid>
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </CourseGrid>
        )}
      </div>
      <LiveActivities />
    </>
  )
}