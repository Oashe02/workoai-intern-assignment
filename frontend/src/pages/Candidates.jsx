import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import api from '../api/axios';
import { cn } from '@/lib/utils';
import AppSidebar from '@/components/AppSidebar';
import {
    IconSearch,
    IconTrash,
    IconUser,
    IconUsers,
    IconFileText,
    IconMail,
    IconPhone,
    IconCalendar,
} from '@tabler/icons-react';

const TopNavbar = ({ title, user }) => (
    <header className="h-16 border-b border-gray-300 bg-gray-100 flex items-center justify-between px-6">
        <div>
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
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

const CandidateCard = ({ candidate, onUpdateStatus, onDelete }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all"
    >
        <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xl font-semibold shadow-lg shadow-blue-500/25">
                {candidate.name.charAt(0)}
            </div>
            <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">{candidate.name}</h3>
                    <StatusBadge status={candidate.status} />
                </div>
                <p className="text-blue-600 font-medium mb-3">{candidate.jobTitle}</p>
                
                <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <IconMail size={14} className="text-gray-400" />
                        <span>{candidate.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <IconPhone size={14} className="text-gray-400" />
                        <span>{candidate.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <IconCalendar size={14} className="text-gray-400" />
                        <span>Added {new Date(candidate.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
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
                            className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all text-sm font-medium"
                        >
                            <IconFileText size={16} />
                            Resume
                        </button>
                    )}
                    
                    <button 
                        onClick={() => onDelete(candidate._id)} 
                        className="ml-auto p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                        <IconTrash size={18} />
                    </button>
                </div>
            </div>
        </div>
    </motion.div>
);

const Candidates = () => {
    const [candidates, setCandidates] = useState([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, reviewed: 0, hired: 0 });
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [longLoading, setLongLoading] = useState(false);

    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const fetchCandidates = async () => {
        try {
            const res = await api.get('/api/candidates');
            setCandidates(res.data.data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError("Failed to load candidates. Please try reloading.");
        }
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
            const timer = setTimeout(() => setLongLoading(true), 3000);
            
            await Promise.all([fetchCandidates(), fetchStats()]);
            
            clearTimeout(timer);
            setLoading(false);
            setLongLoading(false);
        };
        load();
    }, []);

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
            c.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email.toLowerCase().includes(searchTerm.toLowerCase());
        return match && (!filter || c.status === filter);
    });

    return (
        <div className="flex h-screen bg-gray-200 text-gray-900 overflow-hidden">
            <AppSidebar onLogout={handleLogout} stats={stats} currentPath={location.pathname} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <TopNavbar title="Candidates" user={user} />

                <main className="flex-1 overflow-y-auto p-6">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">All Candidates</h1>
                        <p className="text-gray-500 mt-1">View and manage all referred candidates</p>
                    </div>

                    {/* Filters */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <IconSearch size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, job title, or email..."
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

                    {loading ? (
                        <div className="bg-white border border-gray-200 rounded-xl p-20 flex items-center justify-center">
                            <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            {longLoading && (
                                <p className="ml-4 text-gray-500 text-sm">
                                    Waking up the server... This may take up to a minute on the first load.
                                </p>
                            )}
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-20 text-center">
                            <p className="text-red-600 font-medium">{error}</p>
                            <button 
                                onClick={() => window.location.reload()}
                                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition"
                            >
                                Reload Page
                            </button>
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
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {filtered.map((c) => (
                                <CandidateCard 
                                    key={c._id} 
                                    candidate={c} 
                                    onUpdateStatus={updateStatus} 
                                    onDelete={deleteCandidate} 
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Candidates;
