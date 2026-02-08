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

const TopNavbar = ({ user }) => (
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
                <span className="text-sm text-gray-600">{user?.name || 'Admin'}</span>
            </div>
        </div>
    </header>
);

const StatCard = ({ label, value, icon: Icon, color, bgColor }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
    >
        <div className="flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-sm font-medium">{label}</p>
                <p className={cn("text-2xl font-bold mt-1", color)}>{value}</p>
            </div>
            <div className={cn("p-3 rounded-xl", bgColor)}>
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
        <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border", bg, text)}>
            <span className={cn("w-1.5 h-1.5 rounded-full", dot)} />
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
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl shadow-xl z-50 p-6 border border-gray-100"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                            <IconX size={20} />
                        </button>
                    </div>
                    {children}
                </motion.div>
            </>
        )}
    </AnimatePresence>
);

const ReferralForm = ({ onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        jobTitle: '',
        resume: null
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                        required
                        type="text"
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                        placeholder="Oashe Mehta"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                    <input
                        required
                        type="text"
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                        placeholder="Software Engineer"
                        value={formData.jobTitle}
                        onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        required
                        type="email"
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                        placeholder="OAshe@gmail.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                        required
                        type="tel"
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                        placeholder="9876543210"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resume (PDF)</label>
                <div className="relative">
                    <input
                        required
                        type="file"
                        accept=".pdf"
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all text-sm text-gray-500"
                        onChange={e => setFormData({ ...formData, resume: e.target.files[0] })}
                    />
                </div>
            </div>
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 mt-6 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <>
                        <IconPlus size={18} />
                        Submit Referral
                    </>
                )}
            </button>
        </form>
    );
};

const CandidateRow = ({ candidate, index, onUpdateStatus, onDelete }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-all group"
    >
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-md shadow-blue-500/20">
                {candidate.name.charAt(0)}
            </div>
            <div>
                <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                <p className="text-sm text-gray-500">{candidate.jobTitle}</p>
            </div>
        </div>
        
        <div className="flex items-center gap-6">
            <StatusBadge status={candidate.status} />
            <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="hidden sm:block">{new Date(candidate.createdAt).toLocaleDateString()}</span>
                <div className="flex items-center gap-2">
                    <select
                        value={candidate.status}
                        onChange={(e) => onUpdateStatus(candidate._id, e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
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
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Resume"
                        >
                            <IconFileText size={18} />
                        </button>
                    )}
                    
                    <button 
                        onClick={() => onDelete(candidate._id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                    >
                        <IconTrash size={18} />
                    </button>
                </div>
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
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [candidateToDelete, setCandidateToDelete] = useState(null);

    const { user, logout } = useAuth();
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

    const deleteCandidate = (id) => {
        setCandidateToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!candidateToDelete) return;
        try {
            await api.delete(`/api/candidates/${candidateToDelete}`);
            await Promise.all([fetchCandidates(), fetchStats()]);
            setIsDeleteModalOpen(false);
            setCandidateToDelete(null);
        } catch (err) {
            console.error(err);
            alert('Failed to delete candidate');
        }
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
                <TopNavbar user={user} />


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

            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Are you sure you want to delete this candidate? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3 mt-6">
                        <button 
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={confirmDelete}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium shadow-lg shadow-red-500/20"
                        >
                            <IconTrash size={18} />
                            Delete Candidate
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Dashboard;
