import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import api from '../api/axios';
import { cn } from '@/lib/utils';
import AppSidebar from '@/components/AppSidebar';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell,
    Legend
} from 'recharts';
import {
    IconUser,
    IconUsers,
    IconClock,
    IconEye,
    IconCircleCheck,
    IconTrendingUp,
    IconTrendingDown,
    IconChartBar,
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

const StatCard = ({ label, value, icon: Icon, color, bgColor, trend, trendUp }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
    >
        <div className="flex items-start justify-between">
            <div>
                <p className="text-gray-500 text-sm font-medium">{label}</p>
                <p className={cn("text-4xl font-bold mt-2", color)}>{value}</p>
                {trend && (
                    <div className="flex items-center gap-1.5 mt-3">
                        <div className={cn(
                            "flex items-center gap-1 px-2 py-0.5 rounded-full",
                            trendUp ? "bg-emerald-50" : "bg-red-50"
                        )}>
                            {trendUp ? (
                                <IconTrendingUp size={12} className="text-emerald-500" />
                            ) : (
                                <IconTrendingDown size={12} className="text-red-500" />
                            )}
                            <span className={cn(
                                "text-xs font-semibold",
                                trendUp ? "text-emerald-600" : "text-red-600"
                            )}>{trend}</span>
                        </div>
                    </div>
                )}
            </div>
            <div className={cn("p-3 rounded-xl", bgColor)}>
                <Icon size={24} className={color} />
            </div>
        </div>
    </motion.div>
);

const Analytics = () => {
    const [stats, setStats] = useState({ total: 0, pending: 0, reviewed: 0, hired: 0 });
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState([]);
    const [statusData, setStatusData] = useState([]);

    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const processChartData = (candidatesData) => {
        if (!candidatesData) return;

        const days = 30;
        const trend = [];
        const today = new Date();
        
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const shortDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            const count = candidatesData.filter(c => c.createdAt && c.createdAt.startsWith(dateStr)).length;
            trend.push({ name: shortDate, Referrals: count });
        }
        setChartData(trend);

        const statusCounts = candidatesData.reduce((acc, curr) => {
            if (curr.status) {
                acc[curr.status] = (acc[curr.status] || 0) + 1;
            }
            return acc;
        }, {});
        
        setStatusData([
            { name: 'Pending', value: statusCounts.Pending || 0, color: '#f59e0b' },
            { name: 'Reviewed', value: statusCounts.Reviewed || 0, color: '#3b82f6' },
            { name: 'Hired', value: statusCounts.Hired || 0, color: '#10b981' },
        ]);
    };

    const fetchData = async () => {
        try {
            const [statsRes, candidatesRes] = await Promise.all([
                api.get('/api/candidates/stats'),
                api.get('/api/candidates')
            ]);
            
            const data = { total: 0, pending: 0, reviewed: 0, hired: 0 };
            if (statsRes.data && statsRes.data.data) {
                statsRes.data.data.forEach(item => {
                    data[item._id.toLowerCase()] = item.count;
                    data.total += item.count;
                });
            }
            setStats(data);
            
            if (candidatesRes.data && candidatesRes.data.data) {
                setCandidates(candidatesRes.data.data);
                processChartData(candidatesRes.data.data);
            }
        } catch (err) { 
            console.error(err); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const conversionRate = stats.total > 0 ? ((stats.hired / stats.total) * 100).toFixed(1) : "0.0";
    
    const jobTitles = candidates.reduce((acc, c) => {
        if (c.jobTitle) {
            acc[c.jobTitle] = (acc[c.jobTitle] || 0) + 1;
        }
        return acc;
    }, {});
    
    const topJobTitles = Object.entries(jobTitles)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ name, Candidates: count }));

    return (
        <div className="flex h-screen bg-gray-200 text-gray-900 overflow-hidden">
            <AppSidebar onLogout={handleLogout} stats={stats} currentPath={location.pathname} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <TopNavbar title="Analytics Dashboard" user={user} />

                <main className="flex-1 overflow-y-auto p-6">
                    <div className="mb-6 flex justify-between items-end">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
                            <p className="text-gray-500 mt-1">Real-time insights and performance metrics</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="bg-white border border-gray-200 rounded-xl p-20 flex items-center justify-center h-96">
                            <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                <StatCard 
                                    label="Total Referrals" 
                                    value={stats.total} 
                                    icon={IconUsers} 
                                    color="text-gray-900" 
                                    bgColor="bg-gray-100"
                                />
                                <StatCard 
                                    label="Pending Review" 
                                    value={stats.pending} 
                                    icon={IconClock} 
                                    color="text-amber-500" 
                                    bgColor="bg-amber-100"
                                />
                                <StatCard 
                                    label="Under Review" 
                                    value={stats.reviewed} 
                                    icon={IconEye} 
                                    color="text-blue-500" 
                                    bgColor="bg-blue-100"
                                />
                                <StatCard 
                                    label="Hired Candidates" 
                                    value={stats.hired} 
                                    icon={IconCircleCheck} 
                                    color="text-emerald-500" 
                                    bgColor="bg-emerald-100"
                                />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white border border-gray-200 rounded-2xl p-6 lg:col-span-2 shadow-sm"
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <IconTrendingUp size={20} className="text-blue-600" />
                                            </div>
                                            <h2 className="text-lg font-semibold text-gray-900">Referral Trends</h2>
                                        </div>
                                    </div>
                                    <div className="h-80 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="colorReferrals" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} minTickGap={30} />
                                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                                                <RechartsTooltip 
                                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                                    cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }}
                                                />
                                                <Area type="monotone" dataKey="Referrals" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorReferrals)" activeDot={{ r: 6, strokeWidth: 0, fill: '#2563eb' }} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </motion.div>

                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <IconChartBar size={20} className="text-purple-600" />
                                        </div>
                                        <h2 className="text-lg font-semibold text-gray-900">Pipeline Distribution</h2>
                                    </div>
                                    <div className="h-80 w-full relative">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={statusData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                    stroke="none"
                                                >
                                                    {statusData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] text-center pointer-events-none">
                                            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Analytics;
