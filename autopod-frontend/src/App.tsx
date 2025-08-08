import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
// import Footer from './components/Footer';
import Home from './pages/Home';
import Features from './pages/Features';
// import Pricing from './pages/Pricing';
// import Testimonials from './pages/Testimonials';
// import FAQ from './pages/FAQ';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import GeneratePodcast from './pages/GeneratePodcast';

function App() {
  return (
    <Router>
      <div className="min-h-screen text-white">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          {/* <Route path="/pricing" element={<Pricing />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/faq" element={<FAQ />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/generate" element={<GeneratePodcast />} />
        </Routes>
        {/* <Footer /> */}
        <div className="text-center text-xs text-gray-400 py-6 border-t border-white/10">© 2024 ZappPodcast. All rights reserved.</div>
      </div>
    </Router>
  );
}

export default App;