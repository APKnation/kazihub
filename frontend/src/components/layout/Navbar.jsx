import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, LogIn, Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-foreground">
                SkillHub<span className="text-primary">.</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/jobs" className="text-foreground/80 hover:text-foreground font-medium transition-colors">Find Jobs</Link>
            <Link to="/employers" className="text-foreground/80 hover:text-foreground font-medium transition-colors">For Employers</Link>
            
            <div className="flex items-center gap-4 pl-4 border-l border-border">
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
            className="md:hidden p-2 rounded-lg hover:bg-card/50 transition-colors"
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
            className="md:hidden glass border-t border-border/50"
          >
            <div className="px-4 py-6 space-y-4">
              <Link
                to="/jobs"
                onClick={() => setIsOpen(false)}
                className="block text-foreground/80 hover:text-foreground font-medium transition-colors py-2"
              >
                Find Jobs
              </Link>
              <Link
                to="/employers"
                onClick={() => setIsOpen(false)}
                className="block text-foreground/80 hover:text-foreground font-medium transition-colors py-2"
              >
                For Employers
              </Link>
              <div className="pt-4 border-t border-border/50 space-y-3">
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
