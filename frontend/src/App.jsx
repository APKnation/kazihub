import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/jobs" element={<div className="pt-32 text-center text-2xl font-semibold">Jobs Page Coming Soon</div>} />
            <Route path="/employers" element={<div className="pt-32 text-center text-2xl font-semibold">Employers Page Coming Soon</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
