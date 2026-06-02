import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jobsAPI } from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  Briefcase, Plus, Users, CheckCircle, XCircle, Clock, Loader2, LogOut, User, X
} from 'lucide-react';

const statusColor = { PENDING: 'text-yellow-400', ACCEPTED: 'text-emerald-400', REJECTED: 'text-red-400' };
const statusBg   = { PENDING: 'bg-yellow-500/10', ACCEPTED: 'bg-emerald-500/10', REJECTED: 'bg-red-500/10' };

export function EmployerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('jobs');
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [applications, setApplications] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [newJob, setNewJob] = useState({ title: '', description: '', region: '', salary: '' });

  const loadJobs = () => jobsAPI.getPostedJobs()
    .then(res => setJobs(res.data || []))
    .catch(() => setError('Could not load jobs. Ensure the backend is running.'))
    .finally(() => setLoading(false));

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    loadJobs();
  }, [user, navigate]);

  const viewApplications = async (jobId) => {
    setSelectedJobId(jobId);
    setActiveTab('applications');
    try {
      const res = await jobsAPI.getApplicationsForJob(jobId);
      setApplications(res.data || []);
    } catch { setApplications([]); }
  };

  const handleStatusChange = async (appId, status) => {
    try {
      await jobsAPI.updateApplicationStatus(appId, status);
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await jobsAPI.create({ ...newJob, salary: newJob.salary ? Number(newJob.salary) : null });
      setShowCreateModal(false);
      setNewJob({ title: '', description: '', region: '', salary: '' });
      await loadJobs();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create job.');
    } finally {
      setCreating(false);
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };
  const totalApplications = jobs.reduce((sum, j) => sum + (j.applicationCount || 0), 0);

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
              <User className="w-4 h-4" /><span>{user?.name}</span>
            </div>
            <Button variant="ghost" size="sm" className="gap-2" onClick={handleLogout}>
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Employer Dashboard</h1>
            <p className="text-foreground/60 mt-1">Manage your job postings and review applicants.</p>
          </div>
          <Button variant="primary" className="gap-2" onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4" /> Post a Job
          </Button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Jobs Posted', value: jobs.length, color: 'text-primary' },
            { label: 'Total Applicants', value: totalApplications, color: 'text-accent' },
            { label: 'Active Jobs', value: jobs.filter(j => j.status === 'OPEN').length, color: 'text-yellow-400' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card glass className="p-5">
                <div className={`text-3xl font-bold mb-1 ${s.color}`}>{s.value}</div>
                <div className="text-sm text-foreground/60">{s.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-card/50 rounded-xl border border-border w-fit mb-6">
          {['jobs', 'applications'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize ${activeTab === tab ? 'bg-primary text-white shadow' : 'text-foreground/60 hover:text-foreground'}`}>
              {tab === 'jobs' ? `My Jobs (${jobs.length})` : 'Applicants'}
            </button>
          ))}
        </div>

        {error && <div className="text-red-400 text-sm mb-4 p-3 bg-red-500/10 rounded-lg border border-red-500/20">{error}</div>}

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : activeTab === 'jobs' ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {jobs.length === 0 ? (
              <div className="col-span-3 text-center py-16">
                <Briefcase className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
                <p className="text-foreground/50">No jobs posted yet. Click "Post a Job" to get started.</p>
              </div>
            ) : jobs.map((job, i) => (
              <motion.div key={job.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card glass className="h-full flex flex-col hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${job.status === 'OPEN' ? 'bg-accent/20 text-accent' : 'bg-border text-foreground/50'}`}>
                        {job.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col gap-3">
                    <p className="text-foreground/60 text-sm line-clamp-2">{job.description}</p>
                    <div className="flex items-center gap-1 text-foreground/50 text-xs">
                      <Users className="w-3 h-3" /> {job.applicationCount || 0} applicants
                    </div>
                    <Button variant="secondary" size="sm" className="mt-auto w-full gap-2" onClick={() => viewApplications(job.id)}>
                      <Users className="w-4 h-4" /> View Applicants
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div>
            {selectedJobId ? (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <button onClick={() => setActiveTab('jobs')} className="text-foreground/50 hover:text-foreground text-sm">← Back to Jobs</button>
                  <span className="text-foreground/30">/</span>
                  <span className="text-sm font-medium">{jobs.find(j => j.id === selectedJobId)?.title}</span>
                </div>
                <div className="grid gap-3">
                  {applications.length === 0 ? (
                    <p className="text-foreground/50 text-center py-16">No applications for this job yet.</p>
                  ) : applications.map((app, i) => (
                    <motion.div key={app.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <Card glass>
                        <CardContent className="p-4 flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{app.applicantName}</p>
                            <p className="text-sm text-foreground/50">{app.applicantPhone}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusBg[app.status]} ${statusColor[app.status]}`}>
                              {app.status}
                            </span>
                            {app.status === 'PENDING' && (
                              <>
                                <Button variant="accent" size="sm" className="gap-1" onClick={() => handleStatusChange(app.id, 'ACCEPTED')}>
                                  <CheckCircle className="w-3 h-3" /> Accept
                                </Button>
                                <Button variant="secondary" size="sm" className="gap-1 text-red-400 border-red-500/30 hover:bg-red-500/10" onClick={() => handleStatusChange(app.id, 'REJECTED')}>
                                  <XCircle className="w-3 h-3" /> Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-foreground/50 text-center py-16">Select a job from the "My Jobs" tab to see its applicants.</p>
            )}
          </div>
        )}
      </main>

      {/* Create Job Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Post a New Job</CardTitle>
                <button onClick={() => setShowCreateModal(false)} className="text-foreground/50 hover:text-foreground transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreate} className="space-y-4">
                  {[
                    { label: 'Job Title', name: 'title', placeholder: 'e.g. Senior Developer', required: true },
                    { label: 'Region', name: 'region', placeholder: 'e.g. Dar es Salaam', required: false },
                    { label: 'Salary (TSh)', name: 'salary', placeholder: 'e.g. 1500000', required: false, type: 'number' },
                  ].map(field => (
                    <div key={field.name} className="space-y-1">
                      <label className="text-sm font-medium text-foreground/80">{field.label}</label>
                      <input
                        type={field.type || 'text'}
                        value={newJob[field.name]}
                        onChange={e => setNewJob({ ...newJob, [field.name]: e.target.value })}
                        className="w-full h-11 bg-background/50 border border-border rounded-lg px-4 text-foreground focus:outline-none focus:border-primary transition-colors"
                        placeholder={field.placeholder}
                        required={field.required}
                      />
                    </div>
                  ))}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-foreground/80">Description</label>
                    <textarea
                      value={newJob.description}
                      onChange={e => setNewJob({ ...newJob, description: e.target.value })}
                      rows={4}
                      className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                      placeholder="Describe the role and requirements..."
                      required
                    />
                  </div>
                  <Button type="submit" variant="primary" className="w-full" disabled={creating}>
                    {creating ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Posting...</> : 'Post Job'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}
