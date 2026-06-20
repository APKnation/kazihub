import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, Loader2, UserCircle } from 'lucide-react';

export function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    // Clear any stale tokens before attempting login
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    try {
      const user = await login({ phone, password });
      // Role-based redirect after login
      if (user.role === 'JOB_SEEKER') {
        navigate('/dashboard/job-seeker');
      } else if (user.role === 'EMPLOYER') {
        navigate('/dashboard/employer');
      } else if (user.role === 'ADMIN' || user.role === 'STAFF') {
        navigate('/dashboard/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid phone or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4 relative overflow-hidden bg-canvas">

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-none border-hairline bg-canvas-soft">
          <CardHeader className="text-center pt-8 pb-4">
            <div className="w-16 h-16 border border-hairline bg-canvas rounded-md flex items-center justify-center mx-auto mb-4">
              <UserCircle className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-[36px] tracking-[-0.9px] font-normal">Welcome Back</CardTitle>
            <p className="text-body mt-2">Log in to your SkillHub account</p>
          </CardHeader>
          <CardContent className="pb-8">
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

            <form onSubmit={handleSubmit} className="space-y-5 mt-2">
              <div className="space-y-2">
                <label className="text-[14px] font-semibold text-ink">Phone Number</label>
                <div className="relative">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-12 bg-canvas border border-hairline rounded-sm px-4 text-ink focus:outline-none focus:border-primary transition-colors"
                    placeholder="+255 700 000 000"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[14px] font-semibold text-ink">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 bg-canvas border border-hairline rounded-sm px-4 text-ink focus:outline-none focus:border-primary transition-colors"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <Button type="submit" variant="primary" className="w-full mt-6 h-12" disabled={loading}>
                {loading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in...</>
                ) : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center text-[14px] text-body">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:text-primary-soft hover:underline font-semibold transition-colors">Sign up</Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
