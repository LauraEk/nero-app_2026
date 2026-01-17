import { Home, FileText, Settings, ArrowDownCircle, ArrowUpCircle, Calculator } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export function BottomNav() {
    const navItems = [
        { path: '/', label: 'Home', icon: Home },
        { path: '/ankauf', label: 'Ankauf', icon: ArrowDownCircle },
        { path: '/verkauf', label: 'Verkauf', icon: ArrowUpCircle },
        { path: '/belege', label: 'Belege', icon: FileText },
        { path: '/cash-closing', label: 'Kasse', icon: Calculator },
        { path: '/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <nav className="fixed bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-md z-50">
            <div className="rounded-2xl shadow-xl border border-border/50 backdrop-blur-xl bg-background/90 flex items-center justify-between p-2 px-6 ring-1 ring-black/5 dark:ring-white/5">
                {navItems.map(({ path, label, icon: Icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 relative group ${isActive
                                ? 'text-primary'
                                : 'text-muted-foreground hover:text-foreground'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <span className="absolute -top-1 w-1 h-1 bg-primary rounded-full animate-fade-in shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                                )}
                                <div className={`transition-all duration-300 transform ${isActive ? '-translate-y-1 scale-110' : 'group-hover:scale-105'}`}>
                                    <Icon
                                        size={24}
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />
                                </div>
                                <span className={`text-[9px] font-bold uppercase tracking-wide mt-1 transition-all duration-300 absolute -bottom-2 ${isActive
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-2 pointer-events-none'
                                    }`}>
                                    {label}
                                </span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
