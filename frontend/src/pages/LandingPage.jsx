import { motion } from 'framer-motion';
import { ArrowRight, Star, Shield, Zap } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function LandingPage() {
  return (
    <div className="min-h-screen pt-20 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px] -z-10" />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-border/50 border border-border text-sm font-medium mb-8"
        >
          <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse"></span>
          Now connecting talent across Africa
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent"
        >
          Find Your Dream Job.<br />
          Hire Top Talent.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-foreground/70 max-w-2xl mb-10"
        >
          SkillHub Africa is the premier platform connecting skilled professionals with innovative companies. Accelerate your career or build your dream team today.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button variant="primary" size="lg" className="gap-2">
            Explore Jobs <ArrowRight className="w-5 h-5" />
          </Button>
          <Button variant="secondary" size="lg">
            Post a Job
          </Button>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
        >
          {[
            { icon: Star, title: 'Top Talent', desc: 'Access pre-vetted professionals ready to make an impact.' },
            { icon: Zap, title: 'Fast Hiring', desc: 'Streamlined tools to help you hire faster and better.' },
            { icon: Shield, title: 'Secure Platform', desc: 'Enterprise-grade security for your data and communications.' },
          ].map((feat, i) => (
            <div key={i} className="glass p-8 rounded-2xl flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center mb-6">
                <feat.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feat.title}</h3>
              <p className="text-foreground/70">{feat.desc}</p>
            </div>
          ))}
        </motion.div>

      </main>
    </div>
  );
}
