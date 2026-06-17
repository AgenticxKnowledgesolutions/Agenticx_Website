import { useEffect, useState } from 'react'
import CourseGrid from '../components/features/courses/CourseGrid'
import CourseCard from '../components/features/courses/CourseCard'
import LiveActivities from '@/components/features/home/LiveActivities'
import '../styles/courses.css'
import NeuralCanvas from '@/components/ui/NeuralCanvas'
import { getCourses } from '@/services/courseService'
import { CourseCardSkeleton } from '@/components/ui/Skeletons'
import SEO from '@/components/seo/SEO'

export interface CourseData {
  id: string
  title: string
  description: string
  price: number
  duration: string
  mode: string
  icon: string
  slug: string
  coverImageUrl?: string
  brochureUrl?: string
}

export default function Courses() {
  const [courses, setCourses] = useState<CourseData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses()
        const mappedData = data.map(c => ({
          id: c?.id || '',
          title: c?.title || 'Untitled Course',
          description: c?.description || '',
          price: typeof c?.price === 'number' ? c?.price : Number(c?.price) || 0,
          duration: c?.stats?.duration || '12 Weeks',
          mode: c?.stats?.format || 'Remote',
          icon: '🎓',
          slug: c?.slug || '',
          coverImageUrl: c?.coverImageUrl || undefined,
          brochureUrl: c?.brochureUrl || undefined
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
      <SEO 
        title="Explore IT & AI Courses in Kollam | AgenticX"
        description="Upskill with professional IT courses at AgenticX. Offering Python Full Stack, AI, Data Science, and Cyber Security courses with placement assistance."
        keywords="Python Full Stack training, AI course, Cyber Security certification, AgenticX Kollam"
      />

      <div className="courses-page-wrapper">
        <NeuralCanvas nodeCount={30} />
        <div className="container courses-page">

          <div className="courses-header">
            <h1>Our Courses</h1>
            <p>Career Training Programs at AgenticX Knowledge Solutions</p>
          </div>

          {loading || courses.length === 0 ? (
            <CourseGrid>
              {Array.from({ length: 3 }).map((_, i) => (
                <CourseCardSkeleton key={i} />
              ))}
            </CourseGrid>
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