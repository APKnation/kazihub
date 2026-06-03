import { motion } from 'framer-motion';
import { ArrowRight, Star, Shield, Zap, Users, TrendingUp, Briefcase } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function LandingPage() {
  return (
    <div className="min-h-screen pt-20 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Enhanced Background gradients */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/30 rounded-full blur-[150px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/30 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px] -z-10" />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 text-sm font-medium mb-8 backdrop-blur-sm"
        >
          <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse"></span>
          Now connecting talent across Africa
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-br from-foreground via-foreground to-foreground/50 bg-clip-text text-transparent"
        >
          Find Your Dream Job.<br />
          Hire Top Talent.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-foreground/70 max-w-2xl mb-10 leading-relaxed"
        >
          SkillHub Africa is the premier platform connecting skilled professionals with innovative companies. Accelerate your career or build your dream team today.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button variant="primary" size="lg" className="gap-2 shadow-xl shadow-primary/20 hover:shadow-primary/30">
            Explore Jobs <ArrowRight className="w-5 h-5" />
          </Button>
          <Button variant="secondary" size="lg" className="shadow-lg">
            Post a Job
          </Button>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 grid grid-cols-3 gap-8 w-full max-w-3xl"
        >
          {[
            { value: '10K+', label: 'Active Jobs', icon: Briefcase },
            { value: '5K+', label: 'Companies', icon: Users },
            { value: '50K+', label: 'Professionals', icon: TrendingUp },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-foreground/60">{stat.label}</div>
            </div>
          ))}
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
            <motion.div 
              key={i} 
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="glass p-8 rounded-2xl flex flex-col items-center text-center cursor-pointer group"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-primary/30 to-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                <feat.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feat.title}</h3>
              <p className="text-foreground/70 leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-32 glass p-12 rounded-3xl max-w-4xl w-full text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-foreground/70 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals and companies already using SkillHub Africa to transform their careers and businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" className="gap-2 shadow-xl">
              Create Free Account <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="secondary" size="lg">
              Learn More
            </Button>
          </div>
        </motion.div>

      </main>
    </div>
  );
}
