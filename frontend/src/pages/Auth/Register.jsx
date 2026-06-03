import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, Loader2 } from 'lucide-react';

export function Register() {
  const [role, setRole] = useState('JOB_SEEKER');
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', region: '', district: '', ward: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await register({ ...form, role });
      if (user.role === 'JOB_SEEKER') navigate('/dashboard/job-seeker');
      else if (user.role === 'EMPLOYER') navigate('/dashboard/employer');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full h-12 bg-background/60 border border-border/60 rounded-xl px-4 text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all";

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/15 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/15 rounded-full blur-[100px] -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg"
      >
        <Card glass className="shadow-2xl shadow-accent/10">
          <CardHeader className="text-center pt-8 pb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-accent/30 to-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UserCircle className="w-8 h-8 text-accent" />
            </div>
            <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
            <p className="text-foreground/60 mt-2">Join SkillHub Africa today</p>
          </CardHeader>
          <CardContent className="pb-8">
            {/* Role Switcher */}
            <div className="flex gap-2 mb-6 p-1.5 bg-background/60 rounded-xl border border-border/60">
              {['JOB_SEEKER', 'EMPLOYER'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${role === r ? 'bg-primary text-white shadow-md' : 'text-foreground/70 hover:text-foreground hover:bg-card/50'}`}
                >
                  {r === 'JOB_SEEKER' ? 'Job Seeker' : 'Employer'}
                </button>
              ))}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-4"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-medium text-foreground/80">Full Name</label>
                  <input name="name" type="text" value={form.name} onChange={handleChange} className={inputClass} placeholder="John Doe" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">Phone</label>
                  <input name="phone" type="text" value={form.phone} onChange={handleChange} className={inputClass} placeholder="+255 700 000 000" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">Email (optional)</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} placeholder="you@email.com" />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-medium text-foreground/80">Password</label>
                  <input name="password" type="password" value={form.password} onChange={handleChange} className={inputClass} placeholder="••••••••" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">Region</label>
                  <input name="region" type="text" value={form.region} onChange={handleChange} className={inputClass} placeholder="Dar es Salaam" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">District</label>
                  <input name="district" type="text" value={form.district} onChange={handleChange} className={inputClass} placeholder="Ilala" />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-medium text-foreground/80">Ward</label>
                  <input name="ward" type="text" value={form.ward} onChange={handleChange} className={inputClass} placeholder="Gerezani" />
                </div>
              </div>

              <Button type="submit" variant="primary" className="w-full mt-2 h-12 shadow-lg shadow-primary/20" disabled={loading}>
                {loading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating account...</>
                ) : `Sign Up as ${role === 'JOB_SEEKER' ? 'Talent' : 'Employer'}`}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-foreground/60">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium transition-colors">Log in</Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
