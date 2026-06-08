import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useSettingsStore } from './store/useSettingsStore'
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
import CourseEdit from './components/features/admin/courses/CourseEdit'
import ActivityList from './components/features/admin/activities/ActivityList'
import ActivityAdd from './components/features/admin/activities/ActivityAdd'
import ActivityEdit from './components/features/admin/activities/ActivityEdit'
import ReviewList from './components/features/admin/reviews/ReviewList'
import ReviewAdd from './components/features/admin/reviews/ReviewAdd'
import ReviewEdit from './components/features/admin/reviews/ReviewEdit'
import LeadsAdmin from './components/features/admin/LeadsAdmin'
import CompanySettingsAdmin from './components/features/admin/settings/CompanySettingsAdmin'
import ErrorBoundary from './components/ui/ErrorBoundary'

function App() {
  const fetchSettings = useSettingsStore(state => state.fetchSettings)
  const settings = useSettingsStore(state => state.settings)

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  useEffect(() => {
    if (settings) {
      if (settings.metaTitle) {
        document.title = settings.metaTitle;
      }
      if (settings.metaDescription) {
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute('content', settings.metaDescription);
        } else {
          const meta = document.createElement('meta');
          meta.name = 'description';
          meta.content = settings.metaDescription;
          document.head.appendChild(meta);
        }
      }
    }
  }, [settings])

  return (
    <BrowserRouter>
      <Routes>
        {/* Main Public Website */}
        <Route path="/" element={<RootLayout />}>
          <Route index element={<ErrorBoundary><Home /></ErrorBoundary>} />
          <Route path="courses" element={<ErrorBoundary><Courses /></ErrorBoundary>} />
          <Route path="courses/:slug" element={<ErrorBoundary><CourseDetail /></ErrorBoundary>} />
          <Route path="services" element={<ErrorBoundary><Services /></ErrorBoundary>} />
          <Route path="about" element={<ErrorBoundary><About /></ErrorBoundary>} />
          <Route path="contact" element={<ErrorBoundary><Contact /></ErrorBoundary>} />
        </Route>

        {/* Admin Login */}
        <Route path="/admin/login" element={<ErrorBoundary><Login /></ErrorBoundary>} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<ErrorBoundary><AdminLayout /></ErrorBoundary>}>
            <Route path="dashboard" element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
            <Route path="courses" element={<ErrorBoundary><CourseList /></ErrorBoundary>} />
            <Route path="courses/add" element={<ErrorBoundary><CourseAdd /></ErrorBoundary>} />
            <Route path="courses/edit/:id" element={<ErrorBoundary><CourseEdit /></ErrorBoundary>} />
            <Route path="activities" element={<ErrorBoundary><ActivityList /></ErrorBoundary>} />
            <Route path="activities/add" element={<ErrorBoundary><ActivityAdd /></ErrorBoundary>} />
            <Route path="activities/edit/:id" element={<ErrorBoundary><ActivityEdit /></ErrorBoundary>} />
            <Route path="reviews" element={<ErrorBoundary><ReviewList /></ErrorBoundary>} />
            <Route path="reviews/add" element={<ErrorBoundary><ReviewAdd /></ErrorBoundary>} />
            <Route path="reviews/edit/:id" element={<ErrorBoundary><ReviewEdit /></ErrorBoundary>} />
            <Route path="leads" element={<ErrorBoundary><LeadsAdmin /></ErrorBoundary>} />
            <Route path="settings" element={<ErrorBoundary><CompanySettingsAdmin /></ErrorBoundary>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
