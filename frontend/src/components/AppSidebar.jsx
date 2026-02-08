import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import {
    IconHome,
    IconUsers,
    IconChartBar,
    IconLogout,
    IconChevronLeft,
    IconChevronRight,
} from '@tabler/icons-react';

const AppSidebar = ({ onLogout, stats = { pending: 0, reviewed: 0, hired: 0 }, currentPath = '/dashboard' }) => {
    const [collapsed, setCollapsed] = useState(false);

    const navItems = [
        { icon: IconHome, label: 'Dashboard', href: '/dashboard' },
        { icon: IconUsers, label: 'Candidates', href: '/candidates' },
        { icon: IconChartBar, label: 'Analytics', href: '/analytics' },
    ];

    return (
        <motion.aside
            initial={false}
            animate={{ width: collapsed ? 72 : 260 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="h-screen bg-gray-100 border-r border-gray-300 flex flex-col relative"
        >
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-7 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors z-10 shadow-sm"
            >
                {collapsed ? <IconChevronRight size={14} /> : <IconChevronLeft size={14} />}
            </button>

            <div className="p-5 border-b border-gray-100">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/25">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="5" r="2.5" fill="white" />
                            <circle cx="5" cy="18" r="2.5" fill="white" />
                            <circle cx="19" cy="18" r="2.5" fill="white" />
                            <path d="M12 7.5V12M12 12L6.5 16M12 12L17.5 16" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            <circle cx="12" cy="12" r="2" fill="white" opacity="0.6" />
                        </svg>
                    </div>
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.15 }}
                            >
                                <p className="whitespace-nowrap">Referral System</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
                            
            <div className="my-2 h-px bg-gray-100" />

            <nav className="flex-1 p-3 overflow-hidden">
                <div className="space-y-1">
                    {navItems.map((item, idx) => {
                        const isActive = currentPath === item.href;
                        return (
                            <Link
                                key={idx}
                                to={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group",
                                    isActive
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                )}
                            >
                                <item.icon
                                    size={20}
                                    className={cn(
                                        "shrink-0 transition-colors",
                                        isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                                    )}
                                />
                                <AnimatePresence>
                                    {!collapsed && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            transition={{ duration: 0.15 }}
                                            className="text-sm font-medium whitespace-nowrap"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </Link>
                        );
                    })}
                </div>

                <div className="my-4 h-px bg-gray-100" />

                <AnimatePresence>
                    {!collapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="px-3 py-3 bg-gray-50 rounded-lg border border-gray-100"
                        >
                            <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider font-medium">Quick Stats</p>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">Pending</span>
                                    <span className="text-xs font-semibold text-amber-500">{stats.pending}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">Reviewed</span>
                                    <span className="text-xs font-semibold text-blue-500">{stats.reviewed}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">Hired</span>
                                    <span className="text-xs font-semibold text-emerald-500">{stats.hired}</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Footer / Logout */}
            <div className="p-3 border-t border-gray-100">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all group"
                >
                    <IconLogout
                        size={20}
                        className="shrink-0 text-gray-400 group-hover:text-red-500 transition-colors"
                    />
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.15 }}
                                className="text-sm font-medium whitespace-nowrap"
                            >
                                Logout
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>
            </div>
        </motion.aside>
    );
};

export default AppSidebar;
