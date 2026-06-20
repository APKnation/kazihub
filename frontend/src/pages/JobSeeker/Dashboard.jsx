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
  const [isEditing, setIsEditing] = useState(false);
  
  // Application Modal State
  const [applyModalJobId, setApplyModalJobId] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [mapJob, setMapJob] = useState(null);

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
      const payload = {
        age: profile.age === '' ? null : parseInt(profile.age, 10),
        educationLevel: profile.educationLevel || null,
        experience: profile.experience || null,
        portfolioUrl: profile.portfolioUrl || null,
        cvText: profile.cvText || null
      };
      const res = await profileAPI.updateJobSeekerProfile(payload);
      if (res.data) {
        setProfile({
          age: res.data.age || '',
          educationLevel: res.data.educationLevel || '',
          experience: res.data.experience || '',
          portfolioUrl: res.data.portfolioUrl || '',
          cvText: res.data.cvText || ''
        });
      }
      alert('Profile updated successfully!');
      setIsEditing(false);
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
          <div className="flex gap-2.5 mt-auto">
            <button
              disabled={appliedJobIds.has(job.id) || applying === job.id}
              onClick={() => setApplyModalJobId(job.id)}
              className={`flex-1 py-2.5 flex items-center justify-center gap-2 rounded-sm text-[13px] font-medium transition-colors ${
                appliedJobIds.has(job.id) ? 'bg-canvas border border-hairline text-body cursor-not-allowed' :
                applying === job.id ? 'bg-primary/50 text-canvas cursor-not-allowed' :
                'bg-primary text-canvas hover:bg-primary-soft'
              }`}
            >
              {applying === job.id ? <><Loader2 className="w-4 h-4 animate-spin" /> Applying...</> :
               appliedJobIds.has(job.id) ? '✓ Applied' : 'Apply Now'}
            </button>
            <button
              onClick={() => setMapJob(job)}
              title="Show map directions"
              className="px-3.5 bg-canvas border border-hairline text-mute hover:text-primary hover:border-primary rounded-sm flex items-center justify-center transition-colors"
            >
              <MapPin className="w-4 h-4" />
            </button>
          </div>
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
  !isEditing ? (
    // Profile View Mode
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl bg-canvas-soft border border-hairline rounded-sm p-6"
    >
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-hairline">
        <div>
          <h2 className="text-[18px] font-semibold text-ink-strong">My Profile</h2>
          <p className="text-[13px] text-mute">View and manage your account details.</p>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/30 rounded-sm text-[13px] font-medium hover:bg-primary/20 transition-colors"
        >
          Edit Profile
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-[12px] font-mono uppercase tracking-widest text-mute mb-3">Personal Details</h3>
          <div className="grid grid-cols-2 gap-4 bg-canvas/50 p-4 border border-hairline rounded-sm">
            <div>
              <p className="text-[11px] font-mono text-mute uppercase">Full Name</p>
              <p className="text-[14px] font-medium text-ink-strong mt-0.5">{user?.name}</p>
            </div>
            <div>
              <p className="text-[11px] font-mono text-mute uppercase">Phone Number</p>
              <p className="text-[14px] font-medium text-ink-strong mt-0.5">{user?.phone}</p>
            </div>
            <div>
              <p className="text-[11px] font-mono text-mute uppercase">Email</p>
              <p className="text-[14px] font-medium text-ink-strong mt-0.5">{user?.email || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-[11px] font-mono text-mute uppercase">Age</p>
              <p className="text-[14px] font-medium text-ink-strong mt-0.5">{profile.age || 'Not provided'}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-[12px] font-mono uppercase tracking-widest text-mute mb-3">Address / Location</h3>
          <div className="grid grid-cols-3 gap-4 bg-canvas/50 p-4 border border-hairline rounded-sm">
            <div>
              <p className="text-[11px] font-mono text-mute uppercase">Region</p>
              <p className="text-[14px] font-medium text-ink-strong mt-0.5">{user?.region || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-[11px] font-mono text-mute uppercase">District</p>
              <p className="text-[14px] font-medium text-ink-strong mt-0.5">{user?.district || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-[11px] font-mono text-mute uppercase">Ward</p>
              <p className="text-[14px] font-medium text-ink-strong mt-0.5">{user?.ward || 'Not provided'}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-[12px] font-mono uppercase tracking-widest text-mute mb-3">Professional Details</h3>
          <div className="grid grid-cols-2 gap-4 bg-canvas/50 p-4 border border-hairline rounded-sm">
            <div>
              <p className="text-[11px] font-mono text-mute uppercase">Education Level</p>
              <p className="text-[14px] font-medium text-ink-strong mt-0.5">{profile.educationLevel || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-[11px] font-mono text-mute uppercase">Experience</p>
              <p className="text-[14px] font-medium text-ink-strong mt-0.5">{profile.experience || 'Not provided'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-[11px] font-mono text-mute uppercase">Portfolio / LinkedIn</p>
              {profile.portfolioUrl ? (
                <a href={profile.portfolioUrl} target="_blank" rel="noreferrer" className="text-[14px] font-medium text-primary hover:underline mt-0.5 block truncate">
                  {profile.portfolioUrl}
                </a>
              ) : (
                <p className="text-[14px] text-mute mt-0.5">Not provided</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-[12px] font-mono uppercase tracking-widest text-mute mb-2">CV / About Me</h3>
          <div className="bg-canvas/50 p-4 border border-hairline rounded-sm whitespace-pre-wrap text-[14px] text-body leading-relaxed min-h-[100px]">
            {profile.cvText || 'No CV content added yet.'}
          </div>
        </div>
      </div>
    </motion.div>
  ) : (
    // Profile Edit Form Mode
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

        <div className="pt-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-6 py-2.5 bg-canvas border border-hairline text-body rounded-sm text-[13px] font-medium hover:text-ink transition-colors"
          >
            Cancel
          </button>
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
  )
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

      {/* Map Directions Modal */}
      {mapJob && (
        <JobRouteMap 
          job={mapJob} 
          userLocation={{ lat: user?.locationLat, lng: user?.locationLng }} 
          onClose={() => setMapJob(null)} 
        />
      )}
    </div>
  );
}

function JobRouteMap({ job, userLocation, onClose }) {
  const [routeInfo, setRouteInfo] = useState(null);
  const [loadingMap, setLoadingMap] = useState(true);
  const [gpsError, setGpsError] = useState(null);

  useEffect(() => {
    let mapInstance = null;
    let routingControl = null;

    const getCoordinatesAndInit = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            initMap(pos.coords.latitude, pos.coords.longitude);
          },
          (err) => {
            console.warn("GPS access denied, falling back to registered coordinates.");
            const lat = userLocation?.lat || -6.7924;
            const lng = userLocation?.lng || 39.2083;
            initMap(lat, lng);
          },
          { enableHighAccuracy: true, timeout: 5000 }
        );
      } else {
        const lat = userLocation?.lat || -6.7924;
        const lng = userLocation?.lng || 39.2083;
        initMap(lat, lng);
      }
    };

    const initMap = (userLat, userLng) => {
      const jobLat = job.locationLat || -6.7783; 
      const jobLng = job.locationLng || 39.2274;

      try {
        setLoadingMap(true);
        mapInstance = window.L.map('routing-map', { zoomControl: false }).setView([userLat, userLng], 13);
        window.L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstance);

        routingControl = window.L.Routing.control({
          waypoints: [
            window.L.latLng(userLat, userLng),
            window.L.latLng(jobLat, jobLng)
          ],
          routeWhileDragging: false,
          show: true,
          addWaypoints: false,
          draggableWaypoints: false,
          fitSelectedRoutes: true,
          lineOptions: {
            styles: [{ color: '#0ea5e9', weight: 6, opacity: 0.8 }]
          },
          createMarker: function(i, waypoint, n) {
            if (i === 0) {
              return window.L.marker(waypoint.latLng, {
                icon: window.L.divIcon({
                  html: `<div style="width:20px;height:20px;background:#38bdf8;border-radius:50%;border:3px solid white;box-shadow:0 0 0 4px rgba(56,189,248,0.3);"></div>`,
                  iconSize: [20, 20], iconAnchor: [10, 10], className: ''
                })
              }).bindPopup("<b>Your Location</b>");
            } else {
              return window.L.marker(waypoint.latLng, {
                icon: window.L.divIcon({
                  html: `<div style="width:20px;height:20px;background:#10b981;border-radius:50%;border:3px solid white;box-shadow:0 0 0 4px rgba(16,185,129,0.3);"></div>`,
                  iconSize: [20, 20], iconAnchor: [10, 10], className: ''
                })
              }).bindPopup(`<b>${job.title}</b><br/>${job.location || 'Job Site'}`);
            }
          }
        }).addTo(mapInstance);

        routingControl.on('routesfound', function(e) {
          const routes = e.routes;
          const summary = routes[0].summary;
          const distanceKm = (summary.totalDistance / 1000).toFixed(1);
          const durationMin = Math.round(summary.totalTime / 60);
          setRouteInfo({ distance: distanceKm, duration: durationMin });
          setLoadingMap(false);
        });

        routingControl.on('routingerror', function(e) {
          console.error("Routing error:", e);
          setGpsError("Could not find a driving route between your location and the job location.");
          setLoadingMap(false);
        });

      } catch (error) {
        console.error("Error building map:", error);
        setGpsError("Error loading maps. Make sure internet connection is active.");
        setLoadingMap(false);
      }
    };

    getCoordinatesAndInit();

    return () => {
      if (routingControl && mapInstance) {
        try {
          mapInstance.removeControl(routingControl);
        } catch (e) {}
      }
      if (mapInstance) {
        try {
          mapInstance.remove();
        } catch (e) {}
      }
    };
  }, [job, userLocation]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="w-full max-w-4xl bg-canvas-soft border border-hairline rounded-sm flex flex-col overflow-hidden shadow-2xl"
      >
        <div className="flex items-center justify-between p-4 border-b border-hairline bg-canvas">
          <div>
            <h3 className="text-[16px] font-semibold text-ink-strong">Directions to {job.title}</h3>
            <p className="text-[12px] text-mute">{job.companyName || 'Employer'} — {job.location || 'Site Location'}</p>
          </div>
          <button onClick={onClose} className="text-mute hover:text-ink transition-colors p-1.5 hover:bg-canvas border border-hairline rounded-sm">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-hairline">
          <div className="md:col-span-2 relative bg-canvas">
            <div id="routing-map" style={{ height: '450px' }} className="w-full"></div>
            {loadingMap && (
              <div className="absolute inset-0 bg-canvas/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-[13px] text-mute font-medium">Loading live map & routing...</p>
              </div>
            )}
            {gpsError && (
              <div className="absolute inset-0 bg-canvas/95 flex flex-col items-center justify-center p-6 text-center">
                <div className="text-red-500 font-bold mb-2">⚠️ Routing Error</div>
                <p className="text-[13px] text-mute max-w-sm mb-4">{gpsError}</p>
                <button onClick={onClose} className="px-4 py-2 bg-primary text-canvas rounded-sm text-[13px]">Close Map</button>
              </div>
            )}
          </div>

          <div className="p-5 flex flex-col justify-between max-h-[450px] overflow-y-auto bg-canvas-soft">
            <div className="space-y-5">
              <h4 className="text-[12px] font-mono uppercase tracking-widest text-mute">Route Summary</h4>
              
              {routeInfo ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-canvas p-3 border border-hairline rounded-sm">
                    <p className="text-[11px] font-mono text-mute uppercase">Distance</p>
                    <p className="text-[20px] font-mono font-semibold text-primary mt-1">{routeInfo.distance} km</p>
                  </div>
                  <div className="bg-canvas p-3 border border-hairline rounded-sm">
                    <p className="text-[11px] font-mono text-mute uppercase">Est. Time</p>
                    <p className="text-[20px] font-mono font-semibold text-emerald-400 mt-1">{routeInfo.duration} mins</p>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-[13px] text-mute text-center">Calculating route...</div>
              )}

              <div className="border-t border-hairline pt-4 font-sans">
                <h5 className="text-[12px] font-mono uppercase tracking-widest text-mute mb-2">Locations</h5>
                <div className="space-y-3.5 relative pl-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-hairline">
                  <div className="relative">
                    <div className="absolute -left-4 top-1.5 w-2 h-2 rounded-full bg-primary ring-4 ring-primary/20"></div>
                    <p className="text-[11px] font-mono text-mute uppercase leading-none">Starting Point</p>
                    <p className="text-[13px] font-medium text-ink-strong mt-0.5">Your Location (GPS)</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-4 top-1.5 w-2 h-2 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20"></div>
                    <p className="text-[11px] font-mono text-mute uppercase leading-none">Destination</p>
                    <p className="text-[13px] font-medium text-ink-strong mt-0.5">{job.title}</p>
                    <p className="text-[12px] text-mute mt-0.5">{job.location || 'Job Site'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-hairline mt-6 font-sans">
              <p className="text-[11px] text-mute leading-normal">
                Directions are calculated using real-time open-source street data. Follow traffic laws and walk or drive safely.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
