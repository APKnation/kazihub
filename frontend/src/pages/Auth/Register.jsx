import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { locationAPI } from '../../services/api';
import { AlertCircle, Loader2, UserCircle, ChevronDown } from 'lucide-react';

export function Register() {
  const [role, setRole] = useState('JOB_SEEKER');
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', region: '', district: '', ward: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Location data
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [loadingLocations, setLoadingLocations] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Load regions on mount
  useEffect(() => {
    const loadRegions = async () => {
      try {
        setLoadingLocations(true);
        const response = await locationAPI.getRegions();
        setRegions(response.data);
      } catch (err) {
        console.error('Failed to load regions:', err);
      } finally {
        setLoadingLocations(false);
      }
    };
    loadRegions();
  }, []);

  // Load districts when region changes
  useEffect(() => {
    const loadDistricts = async () => {
      if (!selectedRegion) {
        setDistricts([]);
        setWards([]);
        setSelectedDistrict('');
        setForm(prev => ({ ...prev, district: '', ward: '' }));
        return;
      }
      try {
        setLoadingLocations(true);
        const response = await locationAPI.getDistricts(selectedRegion);
        setDistricts(response.data);
        setWards([]);
        setSelectedDistrict('');
        setForm(prev => ({ ...prev, district: '', ward: '' }));
      } catch (err) {
        console.error('Failed to load districts:', err);
      } finally {
        setLoadingLocations(false);
      }
    };
    loadDistricts();
  }, [selectedRegion]);

  // Load wards when district changes
  useEffect(() => {
    const loadWards = async () => {
      if (!selectedDistrict) {
        setWards([]);
        setForm(prev => ({ ...prev, ward: '' }));
        return;
      }
      try {
        setLoadingLocations(true);
        const response = await locationAPI.getWards(selectedDistrict);
        setWards(response.data);
        setForm(prev => ({ ...prev, ward: '' }));
      } catch (err) {
        console.error('Failed to load wards:', err);
      } finally {
        setLoadingLocations(false);
      }
    };
    loadWards();
  }, [selectedDistrict]);

  const handleRegionChange = (e) => {
    const regionId = e.target.value;
    setSelectedRegion(regionId);
    const selectedRegionData = regions.find(r => r.id === parseInt(regionId));
    setForm(prev => ({ ...prev, region: selectedRegionData?.name || '' }));
  };

  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    setSelectedDistrict(districtId);
    const selectedDistrictData = districts.find(d => d.id === parseInt(districtId));
    setForm(prev => ({ ...prev, district: selectedDistrictData?.name || '' }));
  };

  const handleWardChange = (e) => {
    const wardId = e.target.value;
    const selectedWardData = wards.find(w => w.id === parseInt(wardId));
    setForm(prev => ({ ...prev, ward: selectedWardData?.name || '' }));
  };

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

  const inputClass = "w-full h-12 bg-canvas border border-hairline rounded-sm px-4 text-ink focus:outline-none focus:border-primary transition-colors";

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4 relative overflow-hidden bg-canvas">

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg"
      >
        <Card className="shadow-none border-hairline bg-canvas-soft">
          <CardHeader className="text-center pt-8 pb-4">
            <div className="w-16 h-16 border border-hairline bg-canvas rounded-md flex items-center justify-center mx-auto mb-4">
              <UserCircle className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-[36px] tracking-[-0.9px] font-normal">Create Account</CardTitle>
            <p className="text-body mt-2">Join SkillHub Africa today</p>
          </CardHeader>
          <CardContent className="pb-8">
            {/* Role Switcher */}
            <div className="flex gap-2 mb-6 p-1.5 bg-canvas rounded-sm border border-hairline">
              {['JOB_SEEKER', 'EMPLOYER'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2.5 text-[14px] font-semibold rounded-sm transition-all ${role === r ? 'bg-primary text-on-primary' : 'text-body hover:text-ink hover:bg-canvas-soft'}`}
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
                  <label className="text-[14px] font-semibold text-ink">Full Name</label>
                  <input name="name" type="text" value={form.name} onChange={handleChange} className={inputClass} placeholder="John Doe" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[14px] font-semibold text-ink">Phone</label>
                  <input name="phone" type="text" value={form.phone} onChange={handleChange} className={inputClass} placeholder="+255 700 000 000" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[14px] font-semibold text-ink">Email (optional)</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} placeholder="you@email.com" />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-[14px] font-semibold text-ink">Password</label>
                  <input name="password" type="password" value={form.password} onChange={handleChange} className={inputClass} placeholder="••••••••" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[14px] font-semibold text-ink">Region</label>
                  <div className="relative">
                    <select
                      name="region"
                      value={selectedRegion}
                      onChange={handleRegionChange}
                      className={`${inputClass} appearance-none cursor-pointer`}
                      required
                    >
                      <option value="">Select Region</option>
                      {regions.map((region) => (
                        <option key={region.id} value={region.id}>
                          {region.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mute pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[14px] font-semibold text-ink">District</label>
                  <div className="relative">
                    <select
                      name="district"
                      value={selectedDistrict}
                      onChange={handleDistrictChange}
                      className={`${inputClass} appearance-none cursor-pointer ${!selectedRegion ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={!selectedRegion}
                      required
                    >
                      <option value="">Select District</option>
                      {districts.map((district) => (
                        <option key={district.id} value={district.id}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mute pointer-events-none" />
                  </div>
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-[14px] font-semibold text-ink">Ward</label>
                  <div className="relative">
                    <select
                      name="ward"
                      value={form.ward}
                      onChange={handleWardChange}
                      className={`${inputClass} appearance-none cursor-pointer ${!selectedDistrict ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={!selectedDistrict}
                      required
                    >
                      <option value="">Select Ward</option>
                      {wards.map((ward) => (
                        <option key={ward.id} value={ward.id}>
                          {ward.name}
                        </option>
                      ))}
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mute pointer-events-none" />
                  </div>
                </div>
              </div>

              <Button type="submit" variant="primary" className="w-full mt-2 h-12" disabled={loading}>
                {loading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating account...</>
                ) : `Sign Up as ${role === 'JOB_SEEKER' ? 'Talent' : 'Employer'}`}
              </Button>
            </form>

            <div className="mt-6 text-center text-[14px] text-body">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:text-primary-soft hover:underline font-semibold transition-colors">Log in</Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
