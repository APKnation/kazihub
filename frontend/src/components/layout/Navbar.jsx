import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, LogIn, Menu, X, Zap } from 'lucide-react';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-canvas border-b border-hairline">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Zap className="w-6 h-6 text-primary fill-primary" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-ink">
                SkillHub<span className="text-primary">.</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/jobs" className="text-body hover:text-ink font-medium text-[14px] transition-colors">Find Jobs</Link>
            <Link to="/employers" className="text-body hover:text-ink font-medium text-[14px] transition-colors">For Employers</Link>
            
            <div className="flex items-center gap-4 pl-4 border-l border-hairline">
              <Link to="/login">
                <Button variant="ghost" className="gap-2">
                  <LogIn className="w-4 h-4" />
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary">
                  Sign up
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-sm hover:bg-canvas-soft transition-colors text-ink"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-canvas border-t border-hairline"
          >
            <div className="px-4 py-6 space-y-4">
              <Link
                to="/jobs"
                onClick={() => setIsOpen(false)}
                className="block text-body hover:text-ink font-medium transition-colors py-2"
              >
                Find Jobs
              </Link>
              <Link
                to="/employers"
                onClick={() => setIsOpen(false)}
                className="block text-body hover:text-ink font-medium transition-colors py-2"
              >
                For Employers
              </Link>
              <div className="pt-4 border-t border-hairline space-y-3">
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full gap-2">
                    <LogIn className="w-4 h-4" />
                    Log in
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)}>
                  <Button variant="primary" className="w-full">
                    Sign up
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
