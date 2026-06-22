import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Briefcase, ShieldCheck, ShieldOff, LogOut,
  TrendingUp, ToggleLeft, ToggleRight, Loader2, AlertCircle, Plus, X,
  Pencil, Trash2, MapPin, Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { jobsAPI } from '../../services/api';

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [togglingId, setTogglingId] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  
  // Job posting state
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobForm, setJobForm] = useState({ title: '', description: '', location: '', paymentAmount: '', duration: '', status: 'OPEN' });
  const [jobPosting, setJobPosting] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, jobsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/jobs'),
      ]);
      setUsers(usersRes.data);
      setJobs(jobsRes.data);
    } catch (err) {
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUser = async (userId) => {
    try {
      setTogglingId(userId);
      const res = await api.post(`/admin/users/${userId}/toggle-status`);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, active: res.data.active } : u));
    } catch {
      setError('Failed to update user status.');
    } finally {
      setTogglingId(null);
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    setJobPosting(true);
    setError('');
    try {
      const payload = { ...jobForm, paymentAmount: jobForm.paymentAmount ? Number(jobForm.paymentAmount) : null };
      if (editingJob) {
        const res = await jobsAPI.update(editingJob.id, payload);
        setJobs(prev => prev.map(j => j.id === editingJob.id ? res.data : j));
      } else {
        const res = await api.post('/jobs', payload);
        setJobs([res.data, ...jobs]);
      }
      setShowJobModal(false);
      setEditingJob(null);
      setJobForm({ title: '', description: '', location: '', paymentAmount: '', duration: '', status: 'OPEN' });
    } catch (err) {
      setError('Failed to save job.');
    } finally {
      setJobPosting(false);
    }
  };

  const openCreate = () => {
    setEditingJob(null);
    setJobForm({ title: '', description: '', location: '', paymentAmount: '', duration: '', status: 'OPEN' });
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

  const handleDeleteJob = async (id) => {
    setDeletingId(id);
    try {
      await jobsAPI.delete(id);
      setJobs(prev => prev.filter(j => j.id !== id));
      setConfirmDeleteId(null);
    } catch {
      setError('Failed to delete job.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (job) => {
    const newStatus = job.status === 'OPEN' ? 'CLOSED' : 'OPEN';
    try {
      const res = await jobsAPI.update(job.id, { ...job, status: newStatus });
      setJobs(prev => prev.map(j => j.id === job.id ? res.data : j));
    } catch {
      setError('Failed to toggle job status.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const stats = [
    { label: 'Total Users', value: users.length, icon: Users, color: 'text-primary' },
    { label: 'Total Jobs', value: jobs.length, icon: Briefcase, color: 'text-primary' },
    { label: 'Active Users', value: users.filter(u => u.active).length, icon: ShieldCheck, color: 'text-primary' },
    { label: 'Banned Users', value: users.filter(u => !u.active).length, icon: ShieldOff, color: 'text-red-400' },
  ];

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-canvas-soft border-b md:border-b-0 md:border-r border-hairline flex flex-col shrink-0">
        <div className="p-4 md:p-6 border-b border-hairline flex items-center justify-between md:block">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-primary/10 border border-hairline flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-mono uppercase tracking-widest text-mute">Admin Panel</p>
              <p className="text-[15px] font-semibold text-ink-strong truncate">{user?.name}</p>
            </div>
          </div>
        </div>

        <nav className="flex-none md:flex-1 p-3 md:p-4 flex md:flex-col overflow-x-auto gap-2 md:gap-1 space-y-0 md:space-y-1">
          {[
            { id: 'users', label: 'Users', icon: Users },
            { id: 'jobs', label: 'Jobs', icon: Briefcase },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap md:w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-[14px] font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary/10 text-primary border border-primary/30'
                  : 'text-body hover:text-ink hover:bg-canvas'
              }`}
            >
              <tab.icon className="w-4 h-4 shrink-0" />
              {tab.label}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="whitespace-nowrap md:w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-[14px] font-medium text-body hover:text-red-400 hover:bg-red-400/5 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Sign Out
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="border-b border-hairline px-8 py-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-widest text-mute mb-1">SkillHub Africa</p>
            <h1 className="text-[24px] font-semibold tracking-[-0.6px] text-ink-strong">Admin Dashboard</h1>
          </div>
          {activeTab === 'jobs' && (
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2 border border-hairline rounded-sm text-[13px] text-body hover:text-primary hover:border-primary/50 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Post Job
            </button>
          )}
        </div>

        <div className="p-8">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-sm bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-6">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-canvas-soft border border-hairline rounded-sm p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[12px] font-mono uppercase tracking-widest text-mute">{stat.label}</p>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <p className={`text-[32px] font-mono font-semibold ${stat.color}`}>
                  {loading ? '—' : stat.value}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="bg-canvas-soft border border-hairline rounded-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-hairline">
                <h2 className="text-[16px] font-semibold text-ink-strong">All Users</h2>
                <p className="text-[13px] text-mute mt-0.5">Manage platform users and their access</p>
              </div>
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="overflow-x-auto w-full">
                  <table className="w-full min-w-[700px]">
                    <thead>
                      <tr className="border-b border-hairline">
                      {['ID', 'Name', 'Phone', 'Role', 'Region', 'Status', 'Action'].map(h => (
                        <th key={h} className="px-6 py-3 text-left text-[11px] font-mono uppercase tracking-widest text-mute">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <motion.tr
                        key={u.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-b border-hairline last:border-0 hover:bg-canvas transition-colors"
                      >
                        <td className="px-6 py-4 text-[13px] font-mono text-mute">#{u.id}</td>
                        <td className="px-6 py-4 text-[14px] font-medium text-ink-strong">{u.name}</td>
                        <td className="px-6 py-4 text-[13px] font-mono text-body">{u.phone}</td>
                        <td className="px-6 py-4">
                          <span className={`text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm border ${
                            u.role === 'ADMIN' ? 'text-primary border-primary/30 bg-primary/5' :
                            u.role === 'EMPLOYER' ? 'text-blue-400 border-blue-400/30 bg-blue-400/5' :
                            'text-body border-hairline bg-canvas'
                          }`}>{u.role}</span>
                        </td>
                        <td className="px-6 py-4 text-[13px] text-body">{u.region || '—'}</td>
                        <td className="px-6 py-4">
                          <span className={`text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm border ${
                            u.active
                              ? 'text-primary border-primary/30 bg-primary/5'
                              : 'text-red-400 border-red-400/30 bg-red-400/5'
                          }`}>
                            {u.active ? 'Active' : 'Banned'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {u.role !== 'ADMIN' && (
                            <button
                              onClick={() => handleToggleUser(u.id)}
                              disabled={togglingId === u.id}
                              className={`flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-sm border transition-colors ${
                                u.active
                                  ? 'border-red-400/30 text-red-400 hover:bg-red-400/5'
                                  : 'border-primary/30 text-primary hover:bg-primary/5'
                              }`}
                            >
                              {togglingId === u.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : u.active ? (
                                <><ToggleLeft className="w-3 h-3" /> Ban</>
                              ) : (
                                <><ToggleRight className="w-3 h-3" /> Unban</>
                              )}
                            </button>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'jobs' && (
            <div className="bg-canvas-soft border border-hairline rounded-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-hairline flex justify-between items-center">
                <div>
                  <h2 className="text-[16px] font-semibold text-ink-strong">All Jobs</h2>
                  <p className="text-[13px] text-mute mt-0.5">Manage all job listings on the platform</p>
                </div>
              </div>
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="overflow-x-auto w-full">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="border-b border-hairline">
                      {['ID', 'Title', 'Location', 'Status', 'Actions'].map(h => (
                        <th key={h} className="px-6 py-3 text-left text-[11px] font-mono uppercase tracking-widest text-mute">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((j, i) => (
                      <motion.tr
                        key={j.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-b border-hairline last:border-0 hover:bg-canvas transition-colors"
                      >
                        <td className="px-6 py-4 text-[13px] font-mono text-mute">#{j.id}</td>
                        <td className="px-6 py-4 text-[14px] font-medium text-ink-strong">{j.title}</td>
                        <td className="px-6 py-4 text-[13px] text-body">{j.location || '—'}</td>
                        <td className="px-6 py-4">
                          <span className={`text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm border ${
                            j.status === 'OPEN' ? 'text-primary border-primary/30 bg-primary/5' :
                            'text-mute border-hairline bg-canvas'
                          }`}>{j.status}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEdit(j)}
                              title="Edit job"
                              className="p-1.5 text-mute hover:text-primary hover:bg-primary/10 border border-hairline hover:border-primary/30 rounded-sm transition-colors"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(j)}
                              title={j.status === 'OPEN' ? 'Close job' : 'Open job'}
                              className={`p-1.5 border rounded-sm transition-colors ${
                                j.status === 'OPEN'
                                  ? 'text-yellow-500 border-yellow-500/30 hover:bg-yellow-500/10'
                                  : 'text-primary border-primary/30 hover:bg-primary/10'
                              }`}
                            >
                              {j.status === 'OPEN' ? <ToggleLeft className="w-3.5 h-3.5" /> : <ToggleRight className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(j.id)}
                              title="Delete job"
                              className="p-1.5 text-mute hover:text-red-500 hover:bg-red-500/10 border border-hairline hover:border-red-500/30 rounded-sm transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
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
              <form onSubmit={handlePostJob} className="p-6 space-y-4">
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
                      placeholder="e.g. Full-time, 6 Months"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[13px] font-medium text-ink">Payment Amount (Optional)</label>
                    <input
                      type="number"
                      value={jobForm.paymentAmount}
                      onChange={e => setJobForm({...jobForm, paymentAmount: e.target.value})}
                      className="w-full h-10 bg-canvas border border-hairline rounded-sm px-3 text-[14px] text-ink focus:border-primary focus:outline-none transition-colors"
                      placeholder="e.g. 1000000"
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
                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowJobModal(false)}
                    className="px-4 py-2 border border-hairline rounded-sm text-[13px] font-medium text-body hover:text-ink transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={jobPosting}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-canvas rounded-sm text-[13px] font-medium hover:bg-primary-soft transition-colors disabled:opacity-50"
                  >
                    {jobPosting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
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
              <p className="text-[14px] text-body mb-6">This will permanently delete the job and all its applications. This action cannot be undone.</p>
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
