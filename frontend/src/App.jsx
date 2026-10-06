import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileQuickBar from './components/MobileQuickBar';
import HomePage from './pages/HomePage';
import TestsPage from './pages/TestsPage';
import HomeCollectionPage from './pages/HomeCollectionPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PatientDashboard from './pages/PatientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DoctorPortal from './pages/DoctorPortal';
import VerifyReportPage from './pages/VerifyReportPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 pb-16 md:pb-0">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/tests" element={<TestsPage />} />
              <Route path="/home-collection" element={<HomeCollectionPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard/*" element={<PatientDashboard />} />
              <Route path="/admin/*" element={<AdminDashboard />} />
              <Route path="/doctor/*" element={<DoctorPortal />} />
              <Route path="/verify/:code" element={<VerifyReportPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          {/* Sticky quick action bar for smartphone / mobile visitors */}
          <MobileQuickBar />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
