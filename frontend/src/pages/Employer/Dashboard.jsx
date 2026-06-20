import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jobsAPI } from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  Briefcase, Plus, Users, CheckCircle, XCircle, Clock,
  Loader2, LogOut, X, Pencil, Trash2, ToggleLeft, ToggleRight, MapPin
} from 'lucide-react';

const statusColor = { PENDING: 'text-yellow-400', ACCEPTED: 'text-emerald-400', REJECTED: 'text-red-400' };
const statusBg   = { PENDING: 'bg-yellow-500/10', ACCEPTED: 'bg-emerald-500/10', REJECTED: 'bg-red-500/10' };
const EMPTY_JOB  = { title: '', description: '', location: '', paymentAmount: '', duration: '', status: 'OPEN' };

export function EmployerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('jobs');
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');

  // Modals
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null); // null = create mode, object = edit mode
  const [jobForm, setJobForm] = useState(EMPTY_JOB);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

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

  const openCreate = () => {
    setEditingJob(null);
    setJobForm(EMPTY_JOB);
    setShowJobModal(true);
  };

  const openEdit = (job) => {
    setEditingJob(job);
    setJobForm({
      title: job.title || '',
      description: job.description || '',
      location: job.location || '',
      paymentAmount: job.paymentAmount || '',
      duration: job.duration || '',
      status: job.status || 'OPEN',
    });
    setShowJobModal(true);
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...jobForm,
        paymentAmount: jobForm.paymentAmount ? Number(jobForm.paymentAmount) : null,
      };
      if (editingJob) {
        const res = await jobsAPI.update(editingJob.id, payload);
        setJobs(prev => prev.map(j => j.id === editingJob.id ? res.data : j));
      } else {
        await jobsAPI.create(payload);
        await loadJobs();
      }
      setShowJobModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save job.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteJob = async (id) => {
    setDeletingId(id);
    try {
      await jobsAPI.delete(id);
      setJobs(prev => prev.filter(j => j.id !== id));
      setConfirmDeleteId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete job.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (job) => {
    const newStatus = job.status === 'OPEN' ? 'CLOSED' : 'OPEN';
    try {
      const res = await jobsAPI.update(job.id, { ...job, status: newStatus });
      setJobs(prev => prev.map(j => j.id === job.id ? res.data : j));
    } catch (err) {
      alert('Failed to toggle job status.');
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };
  const totalApplications = jobs.reduce((sum, j) => sum + (j.applicationCount || 0), 0);

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-canvas-soft border-b md:border-b-0 md:border-r border-hairline flex flex-col shrink-0">
        <div className="p-4 md:p-6 border-b border-hairline flex items-center justify-between md:block">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-primary/10 border border-hairline flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-mono uppercase tracking-widest text-mute">Employer Panel</p>
              <p className="text-[15px] font-semibold text-ink-strong truncate">{user?.name}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="md:hidden p-2 text-mute hover:text-red-400 transition-colors rounded-sm border border-hairline bg-canvas">
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-none md:flex-1 p-3 md:p-4 flex md:flex-col overflow-x-auto gap-2 md:gap-1 space-y-0 md:space-y-1">
          {[
            { id: 'jobs', label: 'My Jobs', icon: Briefcase, count: jobs.length },
            { id: 'applications', label: 'Applicants', icon: Users, count: totalApplications },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); if(tab.id === 'jobs') setSelectedJobId(null); }}
              className={`whitespace-nowrap md:w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-[14px] font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary/10 text-primary border border-primary/30'
                  : 'text-body hover:text-ink hover:bg-canvas'
              }`}
            >
              <tab.icon className="w-4 h-4 shrink-0" />
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 md:ml-auto bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full font-mono">{tab.count}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="hidden md:block p-4 border-t border-hairline">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-[14px] font-medium text-body hover:text-red-400 hover:bg-red-400/5 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="border-b border-hairline px-8 py-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-widest text-mute mb-1">Employer Dashboard</p>
            <h1 className="text-[24px] font-semibold tracking-[-0.6px] text-ink-strong">Manage Jobs & Applicants</h1>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-canvas rounded-sm text-[13px] font-medium hover:bg-primary-soft transition-colors"
          >
            <Plus className="w-4 h-4" />
            Post a Job
          </button>
        </div>

        <div className="p-8">
          {error && <div className="text-red-400 text-sm mb-6 p-3 bg-red-500/10 rounded-sm border border-red-500/20">{error}</div>}

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Jobs Posted', value: jobs.length, color: 'text-primary', icon: Briefcase },
              { label: 'Total Applicants', value: totalApplications, color: 'text-primary', icon: Users },
              { label: 'Active Jobs', value: jobs.filter(j => j.status === 'OPEN').length, color: 'text-yellow-400', icon: CheckCircle },
            ].map((s, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 16 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.1 }}
                className="bg-canvas-soft border border-hairline rounded-sm p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[12px] font-mono uppercase tracking-widest text-mute">{s.label}</p>
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                </div>
                <div className={`text-[32px] font-mono font-semibold ${s.color}`}>{loading ? '—' : s.value}</div>
              </motion.div>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : activeTab === 'jobs' ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {jobs.length === 0 ? (
                <div className="col-span-3 text-center py-16">
                  <Briefcase className="w-12 h-12 text-mute mx-auto mb-4" />
                  <p className="text-body text-[14px]">No jobs posted yet. Click "Post a Job" to get started.</p>
                </div>
              ) : jobs.map((job, i) => (
                <motion.div 
                  key={job.id} 
                  initial={{ opacity: 0, y: 16 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: i * 0.05 }}
                  className="bg-canvas-soft border border-hairline rounded-sm p-5 flex flex-col hover:border-primary/50 transition-colors"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-[15px] font-semibold text-ink-strong leading-tight max-w-[70%]">{job.title}</h3>
                    <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm border ${
                      job.status === 'OPEN' ? 'text-primary border-primary/30 bg-primary/5' : 'text-mute border-hairline bg-canvas'
                    }`}>
                      {job.status}
                    </span>
                  </div>

                  <p className="text-[13px] text-body line-clamp-2 leading-relaxed mb-3 flex-1">{job.description}</p>

                  {job.location && (
                    <div className="flex items-center gap-1.5 text-mute text-[12px] mb-1">
                      <MapPin className="w-3 h-3" /> {job.location}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-mute text-[12px] mb-4">
                    <Users className="w-3 h-3" /> {job.applicationCount || 0} applicants
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 mt-auto">
                    <button
                      onClick={() => viewApplications(job.id)}
                      className="col-span-2 py-2 flex items-center justify-center gap-2 rounded-sm border border-hairline bg-canvas text-[12px] font-medium text-body hover:text-ink hover:border-primary/50 transition-colors"
                    >
                      <Users className="w-3.5 h-3.5" /> View Applicants
                    </button>
                    <button
                      onClick={() => openEdit(job)}
                      className="py-2 flex items-center justify-center gap-1.5 rounded-sm border border-hairline bg-canvas text-[12px] font-medium text-body hover:text-primary hover:border-primary/50 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleToggleStatus(job)}
                      className={`py-2 flex items-center justify-center gap-1.5 rounded-sm border text-[12px] font-medium transition-colors ${
                        job.status === 'OPEN'
                          ? 'border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10'
                          : 'border-primary/30 text-primary hover:bg-primary/10'
                      }`}
                    >
                      {job.status === 'OPEN' ? <><ToggleLeft className="w-3.5 h-3.5" /> Close</> : <><ToggleRight className="w-3.5 h-3.5" /> Open</>}
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(job.id)}
                      className="col-span-2 py-2 flex items-center justify-center gap-1.5 rounded-sm border border-red-500/30 text-red-500 text-[12px] font-medium hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete Job
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div>
              {selectedJobId ? (
                <>
                  <div className="flex items-center gap-2 mb-6">
                    <button onClick={() => setActiveTab('jobs')} className="text-mute hover:text-ink text-[13px] transition-colors">← Back to Jobs</button>
                    <span className="text-hairline">/</span>
                    <span className="text-[13px] font-medium text-ink-strong">{jobs.find(j => j.id === selectedJobId)?.title} Applicants</span>
                  </div>
                  <div className="grid gap-3">
                    {applications.length === 0 ? (
                      <div className="text-center py-16">
                        <Users className="w-12 h-12 text-mute mx-auto mb-4" />
                        <p className="text-body text-[14px]">No applications for this job yet.</p>
                      </div>
                    ) : applications.map((app, i) => (
                      <motion.div 
                        key={app.id} 
                        initial={{ opacity: 0, y: 8 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: i * 0.05 }}
                        className="bg-canvas-soft border border-hairline rounded-sm p-5 hover:border-primary/30 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 pr-6">
                            <p className="font-semibold text-ink-strong text-[15px]">{app.applicant?.name || 'Unknown Applicant'}</p>
                            <div className="flex items-center gap-2 mt-1 mb-2">
                              <span className="text-[13px] font-mono text-body">{app.applicant?.phone}</span>
                              <span className="text-hairline">•</span>
                              <span className="text-[13px] text-mute">{app.applicant?.email || 'No email'}</span>
                            </div>
                            <p className="text-[12px] text-mute mb-3 uppercase tracking-wider font-mono">
                              {app.applicant?.region || 'Unknown Location'} 
                              {app.applicant?.district ? `, ${app.applicant.district}` : ''}
                            </p>
                            {app.coverLetter && (
                              <div className="mt-4 p-4 bg-canvas rounded-sm border border-hairline text-[13px] text-body">
                                <p className="font-mono text-[11px] mb-2 text-mute uppercase tracking-widest">CV / Cover Letter</p>
                                <p className="whitespace-pre-wrap leading-relaxed">{app.coverLetter}</p>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-3 min-w-[120px]">
                            <span className={`text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-sm border ${statusBg[app.status]} ${statusColor[app.status]} border-current/30`}>
                              {app.status}
                            </span>
                            {app.status === 'PENDING' && (
                              <div className="flex flex-col gap-2 w-full mt-2">
                                <button
                                  onClick={() => handleStatusChange(app.id, 'ACCEPTED')}
                                  className="w-full py-1.5 flex items-center justify-center gap-1.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 rounded-sm text-[12px] font-medium hover:bg-emerald-500/20 transition-colors"
                                >
                                  <CheckCircle className="w-3.5 h-3.5" /> Accept
                                </button>
                                <button
                                  onClick={() => handleStatusChange(app.id, 'REJECTED')}
                                  className="w-full py-1.5 flex items-center justify-center gap-1.5 bg-red-500/10 text-red-500 border border-red-500/30 rounded-sm text-[12px] font-medium hover:bg-red-500/20 transition-colors"
                                >
                                  <XCircle className="w-3.5 h-3.5" /> Reject
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                  <p className="text-body text-[14px]">Select a job from the "My Jobs" tab to see its applicants.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Create / Edit Job Modal */}
      <AnimatePresence>
        {showJobModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-[95%] sm:w-full max-w-lg bg-canvas-soft border border-hairline rounded-sm shadow-xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-hairline">
                <h3 className="text-[18px] font-semibold text-ink-strong">{editingJob ? 'Edit Job' : 'Post New Job'}</h3>
                <button onClick={() => setShowJobModal(false)} className="text-mute hover:text-ink transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSaveJob} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-[13px] font-medium text-ink">Job Title</label>
                  <input
                    required
                    type="text"
                    value={jobForm.title}
                    onChange={e => setJobForm({...jobForm, title: e.target.value})}
                    className="w-full h-10 bg-canvas border border-hairline rounded-sm px-3 text-[14px] text-ink focus:border-primary focus:outline-none transition-colors"
                    placeholder="e.g. Senior Software Engineer"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[13px] font-medium text-ink">Description</label>
                  <textarea
                    required
                    value={jobForm.description}
                    onChange={e => setJobForm({...jobForm, description: e.target.value})}
                    className="w-full h-24 bg-canvas border border-hairline rounded-sm p-3 text-[14px] text-ink focus:border-primary focus:outline-none transition-colors resize-none"
                    placeholder="Job details and requirements..."
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[13px] font-medium text-ink">Location</label>
                    <input
                      type="text"
                      value={jobForm.location}
                      onChange={e => setJobForm({...jobForm, location: e.target.value})}
                      className="w-full h-10 bg-canvas border border-hairline rounded-sm px-3 text-[14px] text-ink focus:border-primary focus:outline-none transition-colors"
                      placeholder="e.g. Dar es Salaam"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[13px] font-medium text-ink">Duration</label>
                    <input
                      type="text"
                      value={jobForm.duration}
                      onChange={e => setJobForm({...jobForm, duration: e.target.value})}
                      className="w-full h-10 bg-canvas border border-hairline rounded-sm px-3 text-[14px] text-ink focus:border-primary focus:outline-none transition-colors"
                      placeholder="e.g. Full-time, 3 Months"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[13px] font-medium text-ink">Salary (TSh, Optional)</label>
                    <input
                      type="number"
                      value={jobForm.paymentAmount}
                      onChange={e => setJobForm({...jobForm, paymentAmount: e.target.value})}
                      className="w-full h-10 bg-canvas border border-hairline rounded-sm px-3 text-[14px] text-ink focus:border-primary focus:outline-none transition-colors"
                      placeholder="e.g. 1500000"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[13px] font-medium text-ink">Status</label>
                    <select
                      value={jobForm.status}
                      onChange={e => setJobForm({...jobForm, status: e.target.value})}
                      className="w-full h-10 bg-canvas border border-hairline rounded-sm px-3 text-[14px] text-ink focus:border-primary focus:outline-none transition-colors"
                    >
                      <option value="OPEN">OPEN</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </div>
                </div>
                {error && <p className="text-red-400 text-[13px]">{error}</p>}
                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowJobModal(false)}
                    className="px-4 py-2 border border-hairline rounded-sm text-[13px] font-medium text-body hover:text-ink transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-canvas rounded-sm text-[13px] font-medium hover:bg-primary-soft transition-colors disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {editingJob ? 'Save Changes' : 'Post Job'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {confirmDeleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-[95%] sm:w-full max-w-sm bg-canvas-soft border border-hairline rounded-sm shadow-xl p-6"
            >
              <h3 className="text-[17px] font-semibold text-ink-strong mb-2">Delete Job?</h3>
              <p className="text-[14px] text-body mb-6">This will permanently delete the job and all its applications. This cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="flex-1 py-2 border border-hairline rounded-sm text-[13px] font-medium text-body hover:text-ink transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteJob(confirmDeleteId)}
                  disabled={deletingId === confirmDeleteId}
                  className="flex-1 py-2 bg-red-500 text-white rounded-sm text-[13px] font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deletingId === confirmDeleteId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
