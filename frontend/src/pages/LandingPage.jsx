import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Shield, Zap, Users, TrendingUp, Briefcase, MapPin, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // Fetch open jobs
    api.get('/jobs/status/OPEN')
      .then(res => setJobs(res.data.slice(0, 6))) // Show latest 6 jobs
      .catch(console.error);
  }, []);

  const handleApplyClick = () => {
    if (user) {
      navigate(user.role === 'JOB_SEEKER' ? '/dashboard/job-seeker' : '/');
    } else {
      navigate('/login');
    }
  };
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
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
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

        {/* Latest Jobs Section */}
        {jobs.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mt-32 w-full text-left"
          >
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
              <div>
                <h2 className="text-[36px] leading-[40px] tracking-[-0.9px] text-ink-strong mb-4">Latest Opportunities</h2>
                <p className="text-[18px] text-body max-w-2xl">Discover open positions and apply to join top companies.</p>
              </div>
              <Button variant="outline" className="mt-6 md:mt-0 gap-2">
                View All Jobs <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job, i) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-canvas-soft border border-hairline rounded-md p-6 flex flex-col hover:border-primary/50 transition-colors group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-canvas border border-hairline rounded-sm flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <span className="text-[12px] font-mono text-mute px-2 py-1 border border-hairline rounded-sm">
                      {job.duration || 'Full-time'}
                    </span>
                  </div>
                  <h3 className="text-[18px] font-semibold text-ink-strong mb-2 truncate" title={job.title}>
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-4 text-[13px] text-body mb-6">
                    {job.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {job.location}
                      </span>
                    )}
                    {job.paymentAmount > 0 && (
                      <span className="flex items-center gap-1 text-primary">
                        Tsh {job.paymentAmount.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="text-[14px] text-body line-clamp-3 mb-6 flex-1">
                    {job.description}
                  </p>
                  <Button variant="primary" className="w-full" onClick={handleApplyClick}>
                    Apply Now
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

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

