import { motion } from 'framer-motion';
import { ArrowRight, Star, Shield, Zap, Users, TrendingUp, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function LandingPage() {
  return (
    <div className="min-h-screen pt-20 flex flex-col items-center justify-center bg-canvas relative overflow-hidden">
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-mono text-[14px] font-semibold tracking-[2.52px] text-primary uppercase mb-8 inline-flex items-center gap-2"
        >
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
          EVERYTHING YOU NEED TO HIRE
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[48px] md:text-[60px] leading-[1.1] md:leading-[60px] font-normal tracking-[-0.65px] text-ink-strong mb-6 max-w-4xl"
        >
          Find Your Dream Job.<br />
          Hire Top Talent.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-[16px] md:text-[18px] leading-[26px] md:leading-[28px] text-body max-w-2xl mb-10"
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
          <Button variant="outline" size="lg">
            Post a Job
          </Button>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl border-t border-b border-hairline py-12"
        >
          {[
            { value: '10,000+', label: 'Active Jobs' },
            { value: '5,000+', label: 'Companies' },
            { value: '50,000+', label: 'Professionals' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-[36px] leading-[40px] tracking-[-0.9px] font-mono text-ink-strong mb-2">
                {stat.value}
              </div>
              <div className="text-[16px] text-body">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
        >
          {[
            { icon: Star, title: 'Top Talent', desc: 'Access pre-vetted professionals ready to make an impact.' },
            { icon: Zap, title: 'Fast Hiring', desc: 'Streamlined tools to help you hire faster and better.' },
            { icon: Shield, title: 'Secure Platform', desc: 'Enterprise-grade security for your data and communications.' },
          ].map((feat, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-canvas border border-hairline p-8 rounded-md flex flex-col items-start text-left group transition-all"
            >
              <div className="w-12 h-12 bg-canvas-soft border border-hairline text-primary rounded-sm flex items-center justify-center mb-6">
                <feat.icon className="w-6 h-6" />
              </div>
              <h3 className="text-[20px] font-semibold text-ink leading-[28px] mb-3">{feat.title}</h3>
              <p className="text-[16px] text-body leading-[26px]">{feat.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-32 bg-canvas-soft border border-hairline p-12 rounded-md max-w-4xl w-full text-center"
        >
          <h2 className="text-[36px] leading-[40px] tracking-[-0.9px] text-ink-strong mb-4">Ready to Get Started?</h2>
          <p className="text-[18px] text-body mb-8 max-w-2xl mx-auto">
            Join thousands of professionals and companies already using SkillHub Africa to transform their careers and businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button variant="primary" size="lg" className="gap-2">
                Create Free Account <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </motion.div>

      </main>
    </div>
  );
}

