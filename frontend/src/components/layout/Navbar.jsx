import { Link } from 'react-router-dom';
import { Briefcase, UserCircle, LogIn } from 'lucide-react';
import { Button } from '../ui/Button';

export function Navbar() {
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
        </div>
      </div>
    </nav>
  );
}
