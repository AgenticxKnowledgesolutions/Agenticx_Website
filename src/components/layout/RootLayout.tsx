import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import AiAssistantFab from '../ui/AiAssistantFab'
import './RootLayout.css'

export default function RootLayout() {
  return (
    <div className="root-layout">
      <Header />
      
      {/* Main Content Area */}
      <main className="main-content">
        <Outlet />
      </main>

      <Footer />
      <AiAssistantFab />
    </div>
  )
}
