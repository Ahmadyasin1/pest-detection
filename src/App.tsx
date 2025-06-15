import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load pages for better performance
const Home = React.lazy(() => import('./pages/Home'));
const Detection = React.lazy(() => import('./pages/Detection'));
const ModelAnalysis = React.lazy(() => import('./pages/ModelAnalysis'));
const Notebook = React.lazy(() => import('./pages/Notebook'));
const Team = React.lazy(() => import('./pages/Team'));
const Reports = React.lazy(() => import('./pages/Reports'));
const About = React.lazy(() => import('./pages/About'));

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="loading-spinner"></div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
          <Navbar />
          <motion.main 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-1"
          >
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/detection" element={<Detection />} />
                <Route path="/model-analysis" element={<ModelAnalysis />} />
                <Route path="/notebook" element={<Notebook />} />
                <Route path="/team" element={<Team />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </Suspense>
          </motion.main>
          <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;