import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

export function Register() {
  const [role, setRole] = useState('JOB_SEEKER');

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[100px] -z-10" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card glass>
          <CardHeader className="text-center pt-8">
            <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
            <p className="text-foreground/60 mt-2">Join SkillHub Africa today</p>
          </CardHeader>
          <CardContent className="pb-8">
            
            <div className="flex gap-2 mb-6 p-1 bg-background/50 rounded-lg border border-border">
              <button 
                onClick={() => setRole('JOB_SEEKER')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${role === 'JOB_SEEKER' ? 'bg-primary text-white shadow-md' : 'text-foreground/70 hover:text-foreground'}`}
              >
                Job Seeker
              </button>
              <button 
                onClick={() => setRole('EMPLOYER')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${role === 'EMPLOYER' ? 'bg-primary text-white shadow-md' : 'text-foreground/70 hover:text-foreground'}`}
              >
                Employer
              </button>
            </div>

            <form className="space-y-4 mt-4" onSubmit={e => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">Full Name</label>
                <input 
                  type="text" 
                  className="w-full h-11 bg-background/50 border border-border rounded-lg px-4 text-foreground focus:outline-none focus:border-primary transition-colors"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">Phone Number</label>
                <input 
                  type="text" 
                  className="w-full h-11 bg-background/50 border border-border rounded-lg px-4 text-foreground focus:outline-none focus:border-primary transition-colors"
                  placeholder="+255 700 000 000"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">Password</label>
                <input 
                  type="password" 
                  className="w-full h-11 bg-background/50 border border-border rounded-lg px-4 text-foreground focus:outline-none focus:border-primary transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <Button type="submit" variant="primary" className="w-full mt-6">
                Sign Up as {role === 'JOB_SEEKER' ? 'Talent' : 'Employer'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-foreground/60">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Log in
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
