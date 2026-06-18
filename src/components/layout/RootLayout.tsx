import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import AiAssistant from '../ai-assistant/AiAssistant'
import './RootLayout.css'

export default function RootLayout() {
  const location = useLocation();
  const isStickyPage = ["/courses", "/about", "/services", "/products", "/careers"].includes(location.pathname);

  return (
    <div className="root-layout">
      <Header />

      {/* Main Content Area */}
      <main className={`main-content ${isStickyPage ? 'main-content-sticky' : ''}`}>
        <Outlet />
      </main>

      <Footer />
      <AiAssistant />
    </div>
  )
}
