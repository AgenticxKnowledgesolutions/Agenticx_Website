import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RootLayout from './components/layout/RootLayout'
import Home from './pages/Home'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import Services from './pages/Services'
import About from './pages/About'
import Contact from './pages/contact/Contact'
import ProtectedRoute from './routes/ProtectedRoute'
import Login from './components/features/admin/Login'
import AdminLayout from './components/layout/AdminLayout'
import Dashboard from './components/features/admin/Dashboard'
import CourseList from './components/features/admin/courses/CourseList'
import CourseAdd from './components/features/admin/courses/CourseAdd'
import ActivityList from './components/features/admin/activities/ActivityList'
import ActivityAdd from './components/features/admin/activities/ActivityAdd'
import ReviewList from './components/features/admin/reviews/ReviewList'
import ReviewAdd from './components/features/admin/reviews/ReviewAdd'
import LeadsAdmin from './components/features/admin/LeadsAdmin'
import ContentAdmin from './components/features/admin/ContentAdmin'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Public Website */}
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/:slug" element={<CourseDetail />} />
          <Route path="services" element={<Services />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* Admin Login */}
        <Route path="/admin/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="courses" element={<CourseList />} />
            <Route path="courses/add" element={<CourseAdd />} />
            <Route path="activities" element={<ActivityList />} />
            <Route path="activities/add" element={<ActivityAdd />} />
            <Route path="reviews" element={<ReviewList />} />
            <Route path="reviews/add" element={<ReviewAdd />} />
            <Route path="leads" element={<LeadsAdmin />} />
            <Route path="content" element={<ContentAdmin />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
