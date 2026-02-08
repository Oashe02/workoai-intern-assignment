import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Dashboard = () => {
    const [candidates, setCandidates] = useState([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, reviewed: 0, hired: 0 });
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const { logout } = useAuth();
    const navigate = useNavigate();

    const fetchCandidates = async () => {
        try {
            const url = filter ? `/api/candidates?status=${filter}` : '/api/candidates';
            const res = await api.get(url);
            setCandidates(res.data.data);
        } catch (err) {
            console.error('Error fetching candidates:', err);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await api.get('/api/candidates/stats');
            const statsData = { total: 0, pending: 0, reviewed: 0, hired: 0 };
            res.data.data.forEach(item => {
                statsData[item._id.toLowerCase()] = item.count;
                statsData.total += item.count;
            });
            setStats(statsData);
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchCandidates(), fetchStats()]);
            setLoading(false);
        };
        loadData();
    }, [filter]);

    const updateStatus = async (id, newStatus) => {
        try {
            await api.put(`/api/candidates/${id}/status`, { status: newStatus });
            fetchCandidates();
            fetchStats();
        } catch (err) {
            console.error('Error updating status:', err);
        }
    };

    const deleteCandidate = async (id) => {
        if (!window.confirm('Are you sure you want to delete this candidate?')) return;
        try {
            await api.delete(`/api/candidates/${id}`);
            fetchCandidates();
            fetchStats();
        } catch (err) {
            console.error('Error deleting candidate:', err);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const filteredCandidates = candidates.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const statusColors = {
        Pending: 'bg-yellow-500/20 text-yellow-400',
        Reviewed: 'bg-blue-500/20 text-blue-400',
        Hired: 'bg-green-500/20 text-green-400'
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-indigo-400 bg-clip-text text-transparent">
                    Candidate Referrals
                </h1>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/refer')}
                        className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all"
                    >
                        + Refer Candidate
                    </button>
                    <button
                        onClick={handleLogout}
                        className="px-5 py-2.5 border border-white/20 rounded-lg text-slate-400 hover:border-red-500 hover:text-red-500 transition-all"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-800/80 rounded-xl p-5 border border-white/10 text-center">
                    <span className="block text-4xl font-bold text-indigo-400">{stats.total}</span>
                    <span className="text-slate-400 text-sm uppercase tracking-wide">Total</span>
                </div>
                <div className="bg-slate-800/80 rounded-xl p-5 border border-white/10 text-center">
                    <span className="block text-4xl font-bold text-yellow-400">{stats.pending}</span>
                    <span className="text-slate-400 text-sm uppercase tracking-wide">Pending</span>
                </div>
                <div className="bg-slate-800/80 rounded-xl p-5 border border-white/10 text-center">
                    <span className="block text-4xl font-bold text-blue-400">{stats.reviewed}</span>
                    <span className="text-slate-400 text-sm uppercase tracking-wide">Reviewed</span>
                </div>
                <div className="bg-slate-800/80 rounded-xl p-5 border border-white/10 text-center">
                    <span className="block text-4xl font-bold text-green-400">{stats.hired}</span>
                    <span className="text-slate-400 text-sm uppercase tracking-wide">Hired</span>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <input
                    type="text"
                    placeholder="Search by name or job title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-3 bg-slate-900/80 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                />
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-3 bg-slate-900/80 border border-white/10 rounded-lg text-white cursor-pointer focus:outline-none focus:border-indigo-500"
                >
                    <option value="">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Reviewed">Reviewed</option>
                    <option value="Hired">Hired</option>
                </select>
            </div>

            {/* Candidates List */}
            {loading ? (
                <p className="text-center text-slate-400 py-12">Loading candidates...</p>
            ) : filteredCandidates.length === 0 ? (
                <p className="text-center text-slate-400 py-12">No candidates found</p>
            ) : (
                <div className="space-y-4">
                    {filteredCandidates.map((candidate) => (
                        <div
                            key={candidate._id}
                            className="bg-slate-800/80 rounded-xl p-5 border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-indigo-500/50 transition-all"
                        >
                            <div>
                                <h3 className="text-xl font-semibold text-white">{candidate.name}</h3>
                                <p className="text-indigo-400 font-medium">{candidate.jobTitle}</p>
                                <p className="text-slate-500 text-sm">{candidate.email} • {candidate.phone}</p>
                            </div>
                            <div className="flex flex-wrap gap-3 items-center">
                                <select
                                    value={candidate.status}
                                    onChange={(e) => updateStatus(candidate._id, e.target.value)}
                                    className={`px-3 py-1.5 rounded-md font-medium cursor-pointer border-none ${statusColors[candidate.status]}`}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Reviewed">Reviewed</option>
                                    <option value="Hired">Hired</option>
                                </select>
                                {candidate.resumeUrl && (
                                    <a
                                        href={candidate.resumeUrl}
                                        target="_blank"
                                        className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-md text-sm"
                                    >
                                        Resume
                                    </a>
                                )}
                                <button
                                    onClick={() => deleteCandidate(candidate._id)}
                                    className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-md text-sm hover:bg-red-500/20 transition-all"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
