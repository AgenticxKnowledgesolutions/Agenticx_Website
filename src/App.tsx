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
import ActivitiesAdmin from './components/features/admin/ActivitiesAdmin'

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
            <Route path="activities" element={<ActivitiesAdmin />} />
            {/* Future admin routes go here */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
