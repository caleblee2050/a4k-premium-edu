import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import './index.css'
import App from './App.jsx'
import VibeBasicPage from './pages/VibeBasicPage.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import AdminVouchersPage from './pages/AdminVouchersPage.jsx'
import AdminMembersPage from './pages/AdminMembersPage.jsx'
import AdminApplicationsPage from './pages/AdminApplicationsPage.jsx'
import AdminCoursesPage from './pages/AdminCoursesPage.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/course/vibe-basic" element={<VibeBasicPage />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/vouchers" element={<AdminVouchersPage />} />
                    <Route path="/admin/members" element={<AdminMembersPage />} />
                    <Route path="/admin/applications" element={<AdminApplicationsPage />} />
                    <Route path="/admin/courses" element={<AdminCoursesPage />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>,
)
