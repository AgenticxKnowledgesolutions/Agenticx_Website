import type { ReactNode } from 'react'

interface CourseGridProps {
  children: ReactNode
}

export default function CourseGrid({ children }: CourseGridProps) {
  return (
    <div className="courses-grid">
      {children}
    </div>
  )
}
