import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import api from '../api/axios';
import { cn } from '@/lib/utils';
import AppSidebar from '@/components/AppSidebar';
import {
    IconPlus,
    IconSearch,
    IconTrash,
    IconX,
    IconClock,
    IconEye,
    IconCircleCheck,
    IconUser,
    IconUsers,
    IconArrowUpRight,
    IconTrendingUp,
    IconFileText,
} from '@tabler/icons-react';

const TopNavbar = () => (
    <header className="h-16 border-b border-gray-300 bg-gray-100 flex items-center justify-between px-6">
        <div>
            <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
            <div className="h-8 w-px bg-gray-300" />
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <IconUser size={16} className="text-white" />
                </div>
                <span className="text-sm text-gray-600">Admin</span>
            </div>
        </div>
    </header>
);

const StatCard = ({ label, value, icon: Icon, color, bgColor, trend }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4, boxShadow: "0 12px 24px -8px rgba(0,0,0,0.15)" }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="bg-white border border-gray-200 rounded-2xl p-6 cursor-pointer relative overflow-hidden group"
    >
        <div className={cn(
            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
            bgColor
        )} style={{ opacity: 0.03 }} />
        
        <div className="flex items-start justify-between relative z-10">
            <div>
                <p className="text-gray-500 text-sm font-medium">{label}</p>
                <p className={cn("text-4xl font-bold mt-2", color)}>{value}</p>
                {trend && (
                    <div className="flex items-center gap-1.5 mt-3">
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 rounded-full">
                            <IconTrendingUp size={12} className="text-emerald-500" />
                            <span className="text-xs text-emerald-600 font-semibold">{trend}</span>
                        </div>
                    </div>
                )}
            </div>
            <div className={cn(
                "p-3 rounded-xl transition-transform group-hover:scale-110",
                bgColor
            )}>
                <Icon size={24} className={color} />
            </div>
        </div>
    </motion.div>
);

const StatusBadge = ({ status }) => {
    const config = {
        Pending: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500' },
        Reviewed: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', dot: 'bg-blue-500' },
        Hired: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    };
    const { bg, text, dot } = config[status] || config.Pending;

    return (
        <span className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border", bg, text)}>
            <span className={cn("w-2 h-2 rounded-full", dot)} />
            {status}
        </span>
    );
};

const Modal = ({ isOpen, onClose, title, children }) => (
    <AnimatePresence>
        {isOpen && (
            <>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl z-50 shadow-2xl overflow-hidden"
                >
                    <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50">
                        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                        <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200 transition-all">
                            <IconX size={20} />
                        </button>
                    </div>
                    <div className="p-5">{children}</div>
                </motion.div>
            </>
        )}
    </AnimatePresence>
);

const ReferralForm = ({ onSubmit, loading }) => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', jobTitle: '' });
    const [resumeFile, setResumeFile] = useState(null);
    const [resumeError, setResumeError] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                setResumeError('Only PDF files are allowed');
                setResumeFile(null);
                return;
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setResumeError('File size must be less than 5MB');
                setResumeFile(null);
                return;
            }
            setResumeError('');
            setResumeFile(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        let resumeData = null;
        let resumeFilename = null;
        
        if (resumeFile) {
            // Convert file to base64
            const reader = new FileReader();
            resumeData = await new Promise((resolve) => {
                reader.onload = () => {
                    const base64 = reader.result.split(',')[1]; // Remove data:application/pdf;base64, prefix
                    resolve(base64);
                };
                reader.readAsDataURL(resumeFile);
            });
            resumeFilename = resumeFile.name;
        }
        
        onSubmit({ ...formData, resumeData, resumeFilename });
    };

    const inputClass = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input type="text" required placeholder="John Smith" value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                <input type="text" required placeholder="Software Engineer" value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })} className={inputClass} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" required placeholder="john@company.com" value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputClass} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input type="tel" required placeholder="+1 (555) 000-0000" value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={inputClass} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Resume (PDF)</label>
                <div className="relative">
                    <input 
                        type="file" 
                        accept=".pdf,application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        id="resume-upload"
                    />
                    <label 
                        htmlFor="resume-upload"
                        className={cn(
                            "flex items-center gap-3 w-full px-4 py-3 bg-gray-50 border border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all",
                            resumeFile && "border-emerald-400 bg-emerald-50/50"
                        )}
                    >
                        <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            resumeFile ? "bg-emerald-100" : "bg-gray-200"
                        )}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke={resumeFile ? "#059669" : "#6B7280"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <polyline points="14,2 14,8 20,8" stroke={resumeFile ? "#059669" : "#6B7280"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <div className="flex-1">
                            {resumeFile ? (
                                <>
                                    <p className="text-sm font-medium text-emerald-700">{resumeFile.name}</p>
                                    <p className="text-xs text-emerald-600">{(resumeFile.size / 1024).toFixed(1)} KB</p>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm text-gray-600">Click to upload resume</p>
                                    <p className="text-xs text-gray-400">PDF only, max 5MB</p>
                                </>
                            )}
                        </div>
                    </label>
                </div>
                {resumeError && <p className="text-red-500 text-sm mt-1">{resumeError}</p>}
            </div>
            <button type="submit" disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50">
                {loading ? 'Adding...' : 'Add Referral'}
            </button>
        </form>
    );
};

const CandidateRow = ({ candidate, onUpdateStatus, onDelete, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ scale: 1.01 }}
        className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-gray-300 transition-all"
    >
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold shadow-lg shadow-blue-500/25">
                    {candidate.name.charAt(0)}
                </div>
                <div>
                    <p className="font-semibold text-gray-900">{candidate.name}</p>
                    <p className="text-sm text-gray-500">{candidate.jobTitle}</p>
                </div>
            </div>
            <div className="flex items-center gap-6">
                <div className="text-right hidden md:block">
                    <p className="text-sm text-gray-600">{candidate.email}</p>
                    <p className="text-xs text-gray-400">{candidate.phone}</p>
                </div>
                <StatusBadge status={candidate.status} />
                <select
                    value={candidate.status}
                    onChange={(e) => onUpdateStatus(candidate._id, e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                    <option value="Pending">Pending</option>
                    <option value="Reviewed">Reviewed</option>
                    <option value="Hired">Hired</option>
                </select>
                {candidate.resumeFilename && (
                    <button 
                        onClick={() => {
                            const token = localStorage.getItem('token');
                            window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/candidates/${candidate._id}/resume?token=${token}`, '_blank');
                        }} 
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                        title="View Resume"
                    >
                        <IconFileText size={18} />
                    </button>
                )}
                <button 
                    onClick={() => onDelete(candidate._id)} 
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                    <IconTrash size={18} />
                </button>
            </div>
        </div>
    </motion.div>
);

const Dashboard = () => {
    const [candidates, setCandidates] = useState([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, reviewed: 0, hired: 0 });
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formLoading, setFormLoading] = useState(false);

    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const fetchCandidates = async () => {
        try {
            const res = await api.get('/api/candidates');
            setCandidates(res.data.data);
        } catch (err) { console.error(err); }
    };

    const fetchStats = async () => {
        try {
            const res = await api.get('/api/candidates/stats');
            const data = { total: 0, pending: 0, reviewed: 0, hired: 0 };
            res.data.data.forEach(item => {
                data[item._id.toLowerCase()] = item.count;
                data.total += item.count;
            });
            setStats(data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            await Promise.all([fetchCandidates(), fetchStats()]);
            setLoading(false);
        };
        load();
    }, []);

    const addCandidate = async (data) => {
        setFormLoading(true);
        try {
            await api.post('/api/candidates', data);
            await Promise.all([fetchCandidates(), fetchStats()]);
            setIsModalOpen(false);
        } catch (err) {
            alert(err.response?.data?.message || 'Error');
        } finally { setFormLoading(false); }
    };

    const updateStatus = async (id, status) => {
        await api.put(`/api/candidates/${id}/status`, { status });
        fetchCandidates();
        fetchStats();
    };

    const deleteCandidate = async (id) => {
        if (!confirm('Delete this candidate?')) return;
        await api.delete(`/api/candidates/${id}`);
        fetchCandidates();
        fetchStats();
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const filtered = candidates.filter(c => {
        const match = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
        return match && (!filter || c.status === filter);
    });

    return (
        <div className="flex h-screen bg-gray-200 text-gray-900 overflow-hidden">
            <AppSidebar onLogout={handleLogout} stats={stats} currentPath={location.pathname} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <TopNavbar />

                <main className="flex-1 overflow-y-auto p-6">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Referrals</h1>
                            <p className="text-gray-500 mt-1">Track and manage candidate referrals</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25"
                        >
                            <IconPlus size={18} />
                            Add Referral
                        </motion.button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                        <StatCard 
                            label="Total Referrals" 
                            value={stats.total} 
                            icon={IconUsers} 
                            color="text-gray-900" 
                            bgColor="bg-gray-100"
                        />
                        <StatCard 
                            label="Pending" 
                            value={stats.pending} 
                            icon={IconClock} 
                            color="text-amber-500" 
                            bgColor="bg-amber-100"
                        />
                        <StatCard 
                            label="Reviewed" 
                            value={stats.reviewed} 
                            icon={IconEye} 
                            color="text-blue-500" 
                            bgColor="bg-blue-100"
                        />
                        <StatCard 
                            label="Hired" 
                            value={stats.hired} 
                            icon={IconCircleCheck} 
                            color="text-emerald-500" 
                            bgColor="bg-emerald-100"
                        />
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <IconSearch size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name or job title..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>
                            <div className="flex gap-2">
                                {['', 'Pending', 'Reviewed', 'Hired'].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setFilter(s)}
                                        className={cn(
                                            "px-5 py-3 rounded-xl text-sm font-semibold transition-all",
                                            filter === s
                                                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
                                                : "bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                                        )}
                                    >
                                        {s || 'All'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {loading ? (
                            <div className="bg-white border border-gray-200 rounded-xl p-20 flex items-center justify-center">
                                <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="bg-white border border-gray-200 rounded-xl p-20 text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                    <IconUsers size={32} className="text-gray-400" />
                                </div>
                                <p className="text-gray-500 font-medium">No candidates found</p>
                                <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
                            </div>
                        ) : (
                            filtered.map((c, i) => (
                                <CandidateRow 
                                    key={c._id} 
                                    candidate={c} 
                                    index={i}
                                    onUpdateStatus={updateStatus} 
                                    onDelete={deleteCandidate} 
                                />
                            ))
                        )}
                    </div>
                </main>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Referral">
                <ReferralForm onSubmit={addCandidate} loading={formLoading} />
            </Modal>
        </div>
    );
};

export default Dashboard;
