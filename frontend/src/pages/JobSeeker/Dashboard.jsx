import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jobsAPI } from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Briefcase, MapPin, Clock, CheckCircle, XCircle, Loader2, LogOut, User } from 'lucide-react';

const statusIcon = { PENDING: Clock, ACCEPTED: CheckCircle, REJECTED: XCircle };
const statusColor = { PENDING: 'text-yellow-400', ACCEPTED: 'text-emerald-400', REJECTED: 'text-red-400' };

export function JobSeekerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);
  const [activeTab, setActiveTab] = useState('browse');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    Promise.all([jobsAPI.getAll(), jobsAPI.getMyApplications()])
      .then(([jobsRes, appsRes]) => {
        setJobs(jobsRes.data || []);
        setApplications(appsRes.data || []);
      })
      .catch(() => setError('Could not load data. Ensure the backend is running.'))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const handleApply = async (jobId) => {
    setApplying(jobId);
    try {
      await jobsAPI.apply(jobId);
      const appsRes = await jobsAPI.getMyApplications();
      setApplications(appsRes.data || []);
      setActiveTab('applications');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply.');
    } finally {
      setApplying(null);
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };
  const appliedJobIds = new Set(applications.map(a => a.jobId));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary/20 rounded-xl flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-lg">SkillHub<span className="text-primary">.</span></span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-foreground/70">
              <User className="w-4 h-4" />
              <span>{user?.name}</span>
            </div>
            <Button variant="ghost" size="sm" className="gap-2" onClick={handleLogout}>
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-foreground/60 mt-1">Discover opportunities that match your skills.</p>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Available Jobs', value: jobs.length, color: 'bg-primary/20 text-primary' },
            { label: 'Applications Sent', value: applications.length, color: 'bg-accent/20 text-accent' },
            { label: 'Pending', value: applications.filter(a => a.status === 'PENDING').length, color: 'bg-yellow-500/20 text-yellow-400' },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card glass className="p-5">
                <div className={`text-3xl font-bold mb-1 ${stat.color.split(' ')[1]}`}>{stat.value}</div>
                <div className="text-sm text-foreground/60">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-card/50 rounded-xl border border-border w-fit mb-6">
          {['browse', 'applications'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize ${activeTab === tab ? 'bg-primary text-white shadow' : 'text-foreground/60 hover:text-foreground'}`}>
              {tab === 'browse' ? 'Browse Jobs' : `My Applications (${applications.length})`}
            </button>
          ))}
        </div>

        {error && <div className="text-red-400 text-sm mb-4 p-3 bg-red-500/10 rounded-lg border border-red-500/20">{error}</div>}

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : activeTab === 'browse' ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {jobs.length === 0 ? (
              <p className="col-span-3 text-center text-foreground/50 py-16">No jobs available right now.</p>
            ) : jobs.map((job, i) => (
              <motion.div key={job.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card glass className="h-full flex flex-col hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <p className="text-primary/80 text-sm font-medium">{job.companyName}</p>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col gap-3">
                    <p className="text-foreground/60 text-sm line-clamp-3">{job.description}</p>
                    <div className="flex items-center gap-1 text-foreground/50 text-xs">
                      <MapPin className="w-3 h-3" /> {job.region || 'Tanzania'}
                    </div>
                    {job.salary && (
                      <div className="text-accent text-sm font-semibold">TSh {job.salary?.toLocaleString()}</div>
                    )}
                    <Button
                      variant={appliedJobIds.has(job.id) ? 'secondary' : 'accent'}
                      size="sm"
                      className="mt-auto w-full"
                      disabled={appliedJobIds.has(job.id) || applying === job.id}
                      onClick={() => handleApply(job.id)}
                    >
                      {applying === job.id ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Applying...</> :
                        appliedJobIds.has(job.id) ? '✓ Applied' : 'Apply Now'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {applications.length === 0 ? (
              <p className="col-span-2 text-center text-foreground/50 py-16">You haven't applied to any jobs yet.</p>
            ) : applications.map((app, i) => {
              const Icon = statusIcon[app.status] || Clock;
              return (
                <motion.div key={app.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card glass className="hover:border-primary/30 transition-colors">
                    <CardContent className="p-5 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{app.jobTitle}</p>
                        <p className="text-sm text-foreground/60">{app.companyName}</p>
                      </div>
                      <div className={`flex items-center gap-1.5 text-sm font-medium ${statusColor[app.status]}`}>
                        <Icon className="w-4 h-4" />
                        {app.status}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
