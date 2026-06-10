import { useEffect, useState, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useSettingsStore } from './store/useSettingsStore'
import AppLoader from './components/ui/AppLoader'
import RootLayout from './components/layout/RootLayout'
import ProtectedRoute from './routes/ProtectedRoute'
import ErrorBoundary from './components/ui/ErrorBoundary'
import { PageSkeleton, AdminSkeleton, CourseDetailSkeleton } from './components/ui/Skeletons'

// Lazy Page Imports
const Home = lazy(() => import('./pages/Home'))
const Courses = lazy(() => import('./pages/Courses'))
const CourseDetail = lazy(() => import('./pages/CourseDetail'))
const Services = lazy(() => import('./pages/Services'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/contact/Contact'))

// Lazy Admin Imports
const Login = lazy(() => import('./components/features/admin/Login'))
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'))
const Dashboard = lazy(() => import('./components/features/admin/Dashboard'))
const CourseList = lazy(() => import('./components/features/admin/courses/CourseList'))
const CourseAdd = lazy(() => import('./components/features/admin/courses/CourseAdd'))
const CourseEdit = lazy(() => import('./components/features/admin/courses/CourseEdit'))
const ActivityList = lazy(() => import('./components/features/admin/activities/ActivityList'))
const ActivityAdd = lazy(() => import('./components/features/admin/activities/ActivityAdd'))
const ActivityEdit = lazy(() => import('./components/features/admin/activities/ActivityEdit'))
const ReviewList = lazy(() => import('./components/features/admin/reviews/ReviewList'))
const ReviewAdd = lazy(() => import('./components/features/admin/reviews/ReviewAdd'))
const ReviewEdit = lazy(() => import('./components/features/admin/reviews/ReviewEdit'))
const LeadsAdmin = lazy(() => import('./components/features/admin/LeadsAdmin'))
const TrashAdmin = lazy(() => import('./components/features/admin/trash/TrashAdmin'))
const CompanySettingsAdmin = lazy(() => import('./components/features/admin/settings/CompanySettingsAdmin'))

function App() {
  const fetchSettings = useSettingsStore(state => state.fetchSettings)
  const settings = useSettingsStore(state => state.settings)
  const [bootstrapFinished, setBootstrapFinished] = useState(false)
  const [showLoader, setShowLoader] = useState(true)

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await fetchSettings();
      } catch (err) {
        console.error("Initial bootstrap failed:", err);
      } finally {
        // Ensure a minimum display of 1500ms for visual smoothness
        setTimeout(() => {
          setBootstrapFinished(true);
          // Unmount after CSS fadeout animation completes (500ms)
          setTimeout(() => {
            setShowLoader(false);
          }, 500);
        }, 1500);
      }
    };
    bootstrap();
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
    <>
      {showLoader && <AppLoader isFadeOut={bootstrapFinished} />}
      <BrowserRouter>
        <Routes>
          {/* Main Public Website */}
          <Route path="/" element={<RootLayout />}>
            <Route index element={<ErrorBoundary><Suspense fallback={<PageSkeleton />}><Home /></Suspense></ErrorBoundary>} />
            <Route path="courses" element={<ErrorBoundary><Suspense fallback={<PageSkeleton />}><Courses /></Suspense></ErrorBoundary>} />
            <Route path="courses/:slug" element={<ErrorBoundary><Suspense fallback={<CourseDetailSkeleton />}><CourseDetail /></Suspense></ErrorBoundary>} />
            <Route path="services" element={<ErrorBoundary><Suspense fallback={<PageSkeleton />}><Services /></Suspense></ErrorBoundary>} />
            <Route path="about" element={<ErrorBoundary><Suspense fallback={<PageSkeleton />}><About /></Suspense></ErrorBoundary>} />
            <Route path="contact" element={<ErrorBoundary><Suspense fallback={<PageSkeleton />}><Contact /></Suspense></ErrorBoundary>} />
          </Route>

          {/* Admin Login */}
          <Route path="/admin/login" element={<ErrorBoundary><Suspense fallback={<PageSkeleton />}><Login /></Suspense></ErrorBoundary>} />

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<ErrorBoundary><Suspense fallback={<AdminSkeleton />}><AdminLayout /></Suspense></ErrorBoundary>}>
              <Route path="dashboard" element={<ErrorBoundary><Suspense fallback={<AdminSkeleton />}><Dashboard /></Suspense></ErrorBoundary>} />
              <Route path="courses" element={<ErrorBoundary><Suspense fallback={<AdminSkeleton />}><CourseList /></Suspense></ErrorBoundary>} />
              <Route path="courses/add" element={<ErrorBoundary><Suspense fallback={<AdminSkeleton />}><CourseAdd /></Suspense></ErrorBoundary>} />
              <Route path="courses/edit/:id" element={<ErrorBoundary><Suspense fallback={<AdminSkeleton />}><CourseEdit /></Suspense></ErrorBoundary>} />
              <Route path="activities" element={<ErrorBoundary><Suspense fallback={<AdminSkeleton />}><ActivityList /></Suspense></ErrorBoundary>} />
              <Route path="activities/add" element={<ErrorBoundary><Suspense fallback={<AdminSkeleton />}><ActivityAdd /></Suspense></ErrorBoundary>} />
              <Route path="activities/edit/:id" element={<ErrorBoundary><Suspense fallback={<AdminSkeleton />}><ActivityEdit /></Suspense></ErrorBoundary>} />
              <Route path="reviews" element={<ErrorBoundary><Suspense fallback={<AdminSkeleton />}><ReviewList /></Suspense></ErrorBoundary>} />
              <Route path="reviews/add" element={<ErrorBoundary><Suspense fallback={<AdminSkeleton />}><ReviewAdd /></Suspense></ErrorBoundary>} />
              <Route path="reviews/edit/:id" element={<ErrorBoundary><Suspense fallback={<AdminSkeleton />}><ReviewEdit /></Suspense></ErrorBoundary>} />
              <Route path="leads" element={<ErrorBoundary><Suspense fallback={<AdminSkeleton />}><LeadsAdmin /></Suspense></ErrorBoundary>} />
              <Route path="trash" element={<ErrorBoundary><Suspense fallback={<AdminSkeleton />}><TrashAdmin /></Suspense></ErrorBoundary>} />
              <Route path="settings" element={<ErrorBoundary><Suspense fallback={<AdminSkeleton />}><CompanySettingsAdmin /></Suspense></ErrorBoundary>} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
