import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Shield, Zap, Users, TrendingUp, Briefcase, MapPin, Clock, X, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [mapJob, setMapJob] = useState(null);

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
                  <div className="flex gap-2.5">
                    <Button variant="primary" className="flex-1" onClick={handleApplyClick}>
                      Apply Now
                    </Button>
                    <button
                      onClick={() => setMapJob(job)}
                      title="Show map directions"
                      className="px-3.5 bg-canvas border border-hairline text-mute hover:text-primary hover:border-primary rounded-sm flex items-center justify-center transition-colors"
                    >
                      <MapPin className="w-4 h-4" />
                    </button>
                  </div>
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

      {/* Map Directions Modal */}
      {mapJob && (
        <JobRouteMap 
          job={mapJob} 
          user={user} 
          onClose={() => setMapJob(null)} 
        />
      )}
    </div>
  );
}

const TANZANIA_REGIONS = {
  'dar es salaam': { lat: -6.7924, lng: 39.2083 },
  'dodoma': { lat: -6.1630, lng: 35.7516 },
  'arusha': { lat: -3.3731, lng: 36.6853 },
  'mwanza': { lat: -2.5164, lng: 32.9018 },
  'kilimanjaro': { lat: -3.3349, lng: 37.3404 },
  'moshi': { lat: -3.3349, lng: 37.3404 },
  'tanga': { lat: -5.0689, lng: 39.0988 },
  'morogoro': { lat: -6.8278, lng: 37.6591 },
  'mbeya': { lat: -8.9094, lng: 33.4607 },
  'iringa': { lat: -7.7731, lng: 35.6994 },
  'kigoma': { lat: -4.8769, lng: 29.6267 },
  'tabora': { lat: -5.0167, lng: 32.8000 },
  'shinyanga': { lat: -3.6619, lng: 33.4219 },
  'kagera': { lat: -1.3323, lng: 31.8106 },
  'bukoba': { lat: -1.3323, lng: 31.8106 },
  'mara': { lat: -1.5007, lng: 33.8047 },
  'musoma': { lat: -1.5007, lng: 33.8047 },
  'manyara': { lat: -4.2155, lng: 35.7487 },
  'babati': { lat: -4.2155, lng: 35.7487 },
  'singida': { lat: -4.8142, lng: 34.7471 },
  'rukwa': { lat: -7.9667, lng: 31.6167 },
  'sumbawanga': { lat: -7.9667, lng: 31.6167 },
  'katavi': { lat: -6.3444, lng: 31.0694 },
  'mpanda': { lat: -6.3444, lng: 31.0694 },
  'ruvuma': { lat: -10.6833, lng: 35.6500 },
  'songea': { lat: -10.6833, lng: 35.6500 },
  'lindi': { lat: -9.9967, lng: 39.7144 },
  'mtwara': { lat: -10.2736, lng: 40.1824 },
  'pwani': { lat: -6.7833, lng: 38.9833 },
  'kibaha': { lat: -6.7833, lng: 38.9833 },
  'geita': { lat: -2.8722, lng: 32.2292 },
  'simiyu': { lat: -2.8000, lng: 33.9833 },
  'bariadi': { lat: -2.8000, lng: 33.9833 },
  'njombe': { lat: -9.3333, lng: 34.7667 },
  'songwe': { lat: -9.1167, lng: 32.9333 },
  'zanzibar': { lat: -6.1659, lng: 39.2026 },
  'pemba': { lat: -5.2284, lng: 39.7561 }
};

function getCoordsForLocation(locationStr, defaultLat = -6.7924, defaultLng = 39.2083) {
  if (!locationStr) return { lat: defaultLat, lng: defaultLng };
  const normalized = locationStr.toLowerCase().trim();
  for (const [key, value] of Object.entries(TANZANIA_REGIONS)) {
    if (normalized.includes(key)) {
      return value;
    }
  }
  return { lat: defaultLat, lng: defaultLng };
}

function JobRouteMap({ job, user, onClose }) {
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
            console.warn("GPS access denied, falling back to profile coordinates.");
            let lat = user?.locationLat;
            let lng = user?.locationLng;
            if (!lat || !lng) {
              const coords = getCoordsForLocation(user?.region || user?.district);
              lat = coords.lat;
              lng = coords.lng;
            }
            initMap(lat, lng);
          },
          { enableHighAccuracy: true, timeout: 5000 }
        );
      } else {
        let lat = user?.locationLat;
        let lng = user?.locationLng;
        if (!lat || !lng) {
          const coords = getCoordsForLocation(user?.region || user?.district);
          lat = coords.lat;
          lng = coords.lng;
        }
        initMap(lat, lng);
      }
    };

    const initMap = (userLat, userLng) => {
      let jobLat = job.locationLat;
      let jobLng = job.locationLng;
      
      if (!jobLat || !jobLng) {
        const coords = getCoordsForLocation(job.location || job.region);
        jobLat = coords.lat;
        jobLng = coords.lng;
      }

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
  }, [job, user]);

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

