import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/Toaster';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import YouTubeTrends from './pages/YouTubeTrends';
import ThumbnailStudio from './pages/ThumbnailStudio';
import ShortsGenerator from './pages/ShortsGenerator';
import SavedIdeas from './pages/SavedIdeas';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-[#0a0a42] to-[#0d0d28] text-white font-body">
          <Navbar />
          <main className="container mx-auto px-4 py-8 pb-24">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/youtube-trends" element={<YouTubeTrends />} />
              <Route path="/thumbnail-studio" element={<ThumbnailStudio />} />
              <Route path="/shorts-generator" element={<ShortsGenerator />} />
              <Route path="/saved-ideas" element={<SavedIdeas />} />
            </Routes>
          </main>
          <Toaster />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;