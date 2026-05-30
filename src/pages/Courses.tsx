import { useEffect, useState } from 'react'
import CourseGrid from '../components/features/courses/CourseGrid'
import CourseCard from '../components/features/courses/CourseCard'
import LiveActivities from '@/components/features/home/LiveActivities'
import '../styles/courses.css'
import NeuralCanvas from '@/components/ui/NeuralCanvas'
import { getCourses } from '@/services/courseService'

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

export default function Courses() {
  const [courses, setCourses] = useState<CourseData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses()
        const mappedData = data.map(c => ({
          id: c.id,
          title: c.title,
          description: c.description,
          price: c.price,
          duration: c.stats.duration,
          mode: c.stats.format,
          icon: '🎓',
          slug: c.slug
        }))
        setCourses(mappedData)
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

      <div className="courses-page-wrapper">
        <NeuralCanvas nodeCount={30} />
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
      </div>
      <LiveActivities />
    </>
  )
}