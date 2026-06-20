import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jobsAPI, profileAPI } from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CardSkeleton, StatSkeleton } from '../../components/ui/Skeleton';
import { Briefcase, MapPin, Clock, CheckCircle, XCircle, Loader2, LogOut, User, X } from 'lucide-react';

const statusIcon = { PENDING: Clock, ACCEPTED: CheckCircle, REJECTED: XCircle };
const statusColor = { PENDING: 'text-yellow-400', ACCEPTED: 'text-emerald-400', REJECTED: 'text-red-400' };
const statusBg = { PENDING: 'bg-yellow-400/10', ACCEPTED: 'bg-emerald-400/10', REJECTED: 'bg-red-400/10' };

export function JobSeekerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);
  const [activeTab, setActiveTab] = useState('browse');
  const [error, setError] = useState('');
  
  // Profile State
  const [profile, setProfile] = useState({
    age: '', educationLevel: '', experience: '', portfolioUrl: '', cvText: ''
  });
  const [updatingProfile, setUpdatingProfile] = useState(false);
  
  // Application Modal State
  const [applyModalJobId, setApplyModalJobId] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    Promise.all([jobsAPI.getAll(), jobsAPI.getMyApplications(), profileAPI.getJobSeekerProfile().catch(() => ({ data: {} }))])
      .then(([jobsRes, appsRes, profileRes]) => {
        setJobs(jobsRes.data || []);
        setApplications(appsRes.data || []);
        if (profileRes.data) {
          setProfile({
            age: profileRes.data.age || '',
            educationLevel: profileRes.data.educationLevel || '',
            experience: profileRes.data.experience || '',
            portfolioUrl: profileRes.data.portfolioUrl || '',
            cvText: profileRes.data.cvText || ''
          });
        }
      })
      .catch(() => setError('Could not load data. Ensure the backend is running.'))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(applyModalJobId);
    try {
      await jobsAPI.apply(applyModalJobId, { coverLetter });
      const appsRes = await jobsAPI.getMyApplications();
      setApplications(appsRes.data || []);
      setActiveTab('applications');
      setApplyModalJobId(null);
      setCoverLetter('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply.');
    } finally {
      setApplying(null);
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };
  const appliedJobIds = new Set(applications.map(a => a.jobId));

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      await profileAPI.updateJobSeekerProfile(profile);
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Failed to update profile.');
    } finally {
      setUpdatingProfile(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-ink flex">
      {/* Sidebar */}
      <aside className="w-64 bg-canvas-soft border-r border-hairline flex flex-col">
        <div className="p-6 border-b border-hairline">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-primary/10 border border-hairline flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[13px] font-mono uppercase tracking-widest text-mute">Job Seeker</p>
              <p className="text-[15px] font-semibold text-ink-strong truncate">{user?.name}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'browse', label: 'Browse Jobs', icon: Briefcase },
            { id: 'applications', label: 'My Applications', icon: CheckCircle },
            { id: 'profile', label: 'My Profile', icon: User },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-[14px] font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary/10 text-primary border border-primary/30'
                  : 'text-body hover:text-ink hover:bg-canvas'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.id === 'applications' && applications.length > 0 && (
                <span className="ml-auto bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full font-mono">{applications.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-hairline">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-[14px] font-medium text-body hover:text-red-400 hover:bg-red-400/5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="border-b border-hairline px-8 py-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-widest text-mute mb-1">Welcome back, {user?.name?.split(' ')[0]}</p>
            <h1 className="text-[24px] font-semibold tracking-[-0.6px] text-ink-strong">Job Seeker Dashboard</h1>
          </div>
        </div>

        <div className="p-8">
          {error && <div className="text-red-400 text-sm mb-6 p-3 bg-red-500/10 rounded-sm border border-red-500/20">{error}</div>}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Available Jobs', value: jobs.length, color: 'text-primary', icon: Briefcase },
              { label: 'Applications Sent', value: applications.length, color: 'text-primary', icon: CheckCircle },
              { label: 'Pending', value: applications.filter(a => a.status === 'PENDING').length, color: 'text-yellow-400', icon: Clock },
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 16 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.1 }}
                className="bg-canvas-soft border border-hairline rounded-sm p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[12px] font-mono uppercase tracking-widest text-mute">{stat.label}</p>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div className={`text-[32px] font-mono font-semibold ${stat.color}`}>{loading ? '—' : stat.value}</div>
              </motion.div>
            ))}
          </div>

{loading ? (
  <div className="flex items-center justify-center py-16">
    <Loader2 className="w-6 h-6 animate-spin text-primary" />
  </div>
) : activeTab === 'browse' ? (
  // Browse Jobs Section
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {jobs.length === 0 ? (
      <div className="col-span-3 text-center py-16">
        <Briefcase className="w-12 h-12 text-mute mx-auto mb-4" />
        <p className="text-body text-[14px]">
          No jobs available right now.
        </p>
      </div>
    ) : (
      jobs.map((job, i) => (
        <motion.div
          key={job.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-canvas-soft border border-hairline rounded-sm p-5 flex flex-col hover:border-primary/50 transition-colors"
        >
          <div className="mb-4">
            <h3 className="text-[16px] font-semibold text-ink-strong leading-tight">{job.title}</h3>
            <p className="text-[13px] text-mute mt-1">{job.companyName}</p>
          </div>
          <p className="text-[14px] text-body line-clamp-3 leading-relaxed mb-4 flex-1">{job.description}</p>
          <div className="flex items-center justify-between mb-4 text-[13px]">
            <div className="flex items-center gap-1.5 text-mute">
              <MapPin className="w-3.5 h-3.5" /> {job.region || 'Tanzania'}
            </div>
            {job.salary && <span className="font-mono text-primary">TSh {job.salary?.toLocaleString()}</span>}
          </div>
          <button
            disabled={appliedJobIds.has(job.id) || applying === job.id}
            onClick={() => setApplyModalJobId(job.id)}
            className={`w-full py-2.5 flex items-center justify-center gap-2 rounded-sm text-[13px] font-medium transition-colors ${
              appliedJobIds.has(job.id) ? 'bg-canvas border border-hairline text-body cursor-not-allowed' :
              applying === job.id ? 'bg-primary/50 text-canvas cursor-not-allowed' :
              'bg-primary text-canvas hover:bg-primary-soft'
            }`}
          >
            {applying === job.id ? <><Loader2 className="w-4 h-4 animate-spin" /> Applying...</> :
             appliedJobIds.has(job.id) ? '✓ Applied' : 'Apply Now'}
          </button>
        </motion.div>
      ))
    )}
  </div>
) : activeTab === 'applications' ? (
  // Applications Section
  <div className="grid gap-4 md:grid-cols-2">
    {applications.length === 0 ? (
      <div className="col-span-2 text-center py-16">
        <Briefcase className="w-12 h-12 text-mute mx-auto mb-4" />
        <p className="text-body text-[14px]">
          You haven't applied to any jobs yet.
        </p>
      </div>
    ) : (
      applications.map((app, i) => {
        const Icon = statusIcon[app.status] || Clock;

        return (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-canvas-soft border border-hairline rounded-sm p-5 flex items-center justify-between"
          >
            <div>
              <p className="text-[15px] font-semibold text-ink-strong">
                {app.jobTitle}
              </p>
              <p className="text-[13px] text-mute">
                {app.companyName}
              </p>
            </div>

            <div
              className={`flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-sm border ${statusBg[app.status]} ${statusColor[app.status]} border-current/30`}
            >
              <Icon className="w-3 h-3" />
              {app.status}
            </div>
          </motion.div>
        );
      })
    )}
  </div>
) : activeTab === 'profile' ? (
  // Profile Section
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-2xl bg-canvas-soft border border-hairline rounded-sm p-6"
  >
    <h2 className="text-[18px] font-semibold text-ink-strong mb-6">
      Profile Settings
    </h2>

    <form onSubmit={handleUpdateProfile} className="space-y-5">
      <div className="grid grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-ink">Age (Optional)</label>
          <input
            type="number"
            value={profile.age}
            onChange={e => setProfile({...profile, age: e.target.value})}
            className="w-full h-10 bg-canvas border border-hairline rounded-sm px-3 text-[14px] text-ink focus:border-primary focus:outline-none transition-colors"
            placeholder="e.g. 25"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-ink">Education Level (Optional)</label>
          <select
            value={profile.educationLevel}
            onChange={e => setProfile({...profile, educationLevel: e.target.value})}
            className="w-full h-10 bg-canvas border border-hairline rounded-sm px-3 text-[14px] text-ink focus:border-primary focus:outline-none transition-colors"
          >
            <option value="">Select Level</option>
            <option value="High School">High School</option>
            <option value="Diploma">Diploma</option>
            <option value="Bachelor's Degree">Bachelor's Degree</option>
            <option value="Master's Degree">Master's Degree</option>
            <option value="PhD">PhD</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[13px] font-medium text-ink">Years of Experience (Optional)</label>
        <input
          type="text"
          value={profile.experience}
          onChange={e => setProfile({...profile, experience: e.target.value})}
          className="w-full h-10 bg-canvas border border-hairline rounded-sm px-3 text-[14px] text-ink focus:border-primary focus:outline-none transition-colors"
          placeholder="e.g. 3 years in Web Development"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[13px] font-medium text-ink">Portfolio / LinkedIn URL (Optional)</label>
        <input
          type="url"
          value={profile.portfolioUrl}
          onChange={e => setProfile({...profile, portfolioUrl: e.target.value})}
          className="w-full h-10 bg-canvas border border-hairline rounded-sm px-3 text-[14px] text-ink focus:border-primary focus:outline-none transition-colors"
          placeholder="https://"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[13px] font-medium text-ink">CV / About Me Summary (Optional)</label>
        <p className="text-[11px] text-mute mb-2">This will be sent along with your applications if you don't provide a custom one.</p>
        <textarea
          value={profile.cvText}
          onChange={e => setProfile({...profile, cvText: e.target.value})}
          rows={6}
          className="w-full bg-canvas border border-hairline rounded-sm p-3 text-[14px] text-ink focus:border-primary focus:outline-none transition-colors resize-none"
          placeholder="Write a brief summary of your skills and experience..."
        />
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={updatingProfile}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-canvas rounded-sm text-[13px] font-medium hover:bg-primary-soft transition-colors disabled:opacity-50"
        >
          {updatingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Update Profile
        </button>
      </div>
    </form>
  </motion.div>
) : null}
        </div>
      </main>

      {/* Apply Modal */}
      {applyModalJobId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Submit Application</CardTitle>
                <button onClick={() => setApplyModalJobId(null)} className="text-foreground/50 hover:text-foreground transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleApply} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/80">CV / Cover Letter</label>
                    <p className="text-xs text-foreground/50 mb-2">Paste your CV details or write a brief cover letter explaining why you're a good fit for this role.</p>
                    <textarea
                      value={coverLetter}
                      onChange={e => setCoverLetter(e.target.value)}
                      rows={8}
                      className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                      placeholder="Write your cover letter or paste your CV here..."
                      required
                    />
                  </div>
                  <Button type="submit" variant="primary" className="w-full" disabled={applying !== null}>
                    {applying !== null ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Submitting...</> : 'Submit Application'}
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
