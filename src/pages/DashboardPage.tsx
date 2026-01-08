import { useState } from 'react';
import { useTransactions } from '@/hooks/use-transactions';
import { useSettings } from '@/hooks/use-settings';
import { CountUp } from '@/components/ui/CountUp';
import {
    ArrowUpCircle,
    ArrowDownCircle,
    Wallet,
    ArrowRight,
    Eye,
    EyeOff,
    Sparkles,
    TrendingUp,
    TrendingDown
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
    const { transactions } = useTransactions();
    const { settings } = useSettings();
    const [hideValues, setHideValues] = useState(false);

    const sales = transactions.filter(t => t.type === 'sale');
    const purchases = transactions.filter(t => t.type === 'purchase');

    const totalSales = sales.reduce((acc, t) => acc + t.totalGross, 0);
    const totalPurchases = purchases.reduce((acc, t) => acc + t.totalGross, 0);
    const totalProfit = totalSales - totalPurchases;

    return (
        <div className="space-y-8 pb-24 text-foreground relative max-w-md mx-auto">
            {/* Background Decoration */}
            <div className="fixed top-0 left-0 right-0 h-[400px] z-[-1] bg-gradient-to-b from-primary/5 via-background to-background pointer-events-none" />

            {/* Header Section */}
            <div className="relative animate-slide-up flex justify-between items-center px-1 py-2" style={{ animationDelay: '0ms' }}>
                <div className="flex items-center gap-4">
                    {settings.logoUrl ? (
                        <div className="w-14 h-14 flex items-center justify-center">
                            <img
                                src={settings.logoUrl}
                                alt="Logo"
                                className="w-full h-full object-contain drop-shadow-sm"
                            />
                        </div>
                    ) : (
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                            N
                        </div>
                    )}
                    <div>
                        <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground/80 mb-0.5">Hallo,</p>
                        <h1 className="text-2xl font-black leading-none tracking-tight">
                            {settings.companyName || 'Dein Unternehmen'}
                        </h1>
                    </div>
                </div>

                <button
                    onClick={() => setHideValues(!hideValues)}
                    className="p-2 text-muted-foreground/50 hover:text-foreground transition-colors active:scale-95"
                    title={hideValues ? "Werte anzeigen" : "Werte verbergen"}
                >
                    {hideValues ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
            </div>

            {/* Dashboard Hero Section - Shared Gradient Layer */}
            <div className="relative isolate flex flex-col gap-3">
                {/* 
                   SHARED CONTINUOUS GRADIENT
                   This element sits behind all 3 cards and creates the unified flow effect.
                   It spans the full height of the container.
                */}
                <div className="absolute inset-0 -z-10 rounded-[32px] bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-80" />
                <div className="absolute top-0 right-0 -z-10 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

                {/* 1. HERO CARD (Balance) */}
                <div className="relative overflow-hidden rounded-[26px] p-7 shadow-lg border border-border/50 bg-card/40 backdrop-blur-sm transition-all duration-300">
                    <div className="flex flex-col text-center space-y-7">
                        <div className="space-y-2 w-full flex flex-col items-center border-b border-border/10 pb-7">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border border-border/20 bg-background/50 shadow-sm text-foreground/70">
                                <Sparkles size={10} /> Aktuelle Bilanz
                            </span>
                            <h2 className={`text-5xl font-extrabold tracking-tighter ${hideValues ? 'blur-md select-none opacity-50 scale-95' : ''} transition-all duration-300`}>
                                {hideValues ? '8.888€' : <CountUp end={totalProfit} suffix="€" duration={1.5} />}
                            </h2>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 w-full gap-8">
                            <div className="text-center space-y-1">
                                <div className="flex items-center justify-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider opacity-90">
                                    <TrendingUp size={12} /> Einnahmen
                                </div>
                                <p className={`text-lg font-bold tracking-tight ${hideValues ? 'blur-sm select-none opacity-50' : ''}`}>
                                    {hideValues ? '1234' : <CountUp end={totalSales} suffix="€" />}
                                </p>
                            </div>
                            <div className="text-center space-y-1">
                                <div className="flex items-center justify-center gap-1.5 text-orange-600 dark:text-orange-400 text-[10px] font-bold uppercase tracking-wider opacity-90">
                                    <TrendingDown size={12} /> Ausgaben
                                </div>
                                <p className={`text-lg font-bold tracking-tight ${hideValues ? 'blur-sm select-none opacity-50' : ''}`}>
                                    {hideValues ? '1234' : <CountUp end={totalPurchases} suffix="€" />}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. & 3. ACTION BUTTONS (Ankauf/Verkauf) */}
                <div className="grid grid-cols-2 gap-3">
                    <Link
                        to="/ankauf"
                        className="group relative overflow-hidden flex flex-col items-center justify-center gap-3 p-5 rounded-[20px] 
                            bg-card/40 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300
                            hover:bg-card/60 hover:border-orange-200 dark:hover:border-orange-500/30"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                            <ArrowDownCircle size={24} />
                        </div>
                        <div className="text-center">
                            <span className="block font-bold text-base text-foreground">Ankauf</span>
                            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide group-hover:text-orange-600/80 dark:group-hover:text-orange-400/80 transition-colors">Ausgabe</span>
                        </div>
                    </Link>

                    <Link
                        to="/verkauf"
                        className="group relative overflow-hidden flex flex-col items-center justify-center gap-3 p-5 rounded-[20px] 
                            bg-card/40 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300
                            hover:bg-card/60 hover:border-emerald-200 dark:hover:border-emerald-500/30"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                            <ArrowUpCircle size={24} />
                        </div>
                        <div className="text-center">
                            <span className="block font-bold text-base text-foreground">Verkauf</span>
                            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide group-hover:text-emerald-600/80 dark:group-hover:text-emerald-400/80 transition-colors">Einnahme</span>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="space-y-5 animate-slide-up" style={{ animationDelay: '300ms' }}>
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                        Letzte Buchungen
                    </h3>
                    <Link to="/belege" className="text-xs font-semibold text-primary hover:underline group flex items-center gap-1">
                        Alle anzeigen <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>

                <div className="space-y-0 divide-y divide-border/40">
                    {transactions.length === 0 ? (
                        <div className="text-center py-12 rounded-3xl border border-dashed border-muted-foreground/20 bg-muted/10 mx-2">
                            <Wallet className="mx-auto h-12 w-12 text-muted-foreground/20 mb-3" />
                            <p className="text-sm text-muted-foreground/60 font-medium">Noch keine Buchungen</p>
                            <div className="flex justify-center gap-2 mt-3">
                                <Link to="/ankauf" className="text-xs text-primary hover:underline">Ankauf</Link>
                                <span className="text-xs text-muted-foreground">•</span>
                                <Link to="/verkauf" className="text-xs text-primary hover:underline">Verkauf</Link>
                            </div>
                        </div>
                    ) : (
                        transactions.slice(0, 5).map((t) => (
                            <div
                                key={t.id}
                                className="flex items-center justify-between py-4 px-2 hover:bg-muted/30 transition-colors first:pt-2 rounded-lg"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border shadow-sm ${t.type === 'sale'
                                        ? 'bg-emerald-500 border-emerald-600 text-white'
                                        : 'bg-orange-500 border-orange-600 text-white'
                                        }`}>
                                        {t.type === 'sale' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                                    </div>
                                    <div>
                                        <p className={`font-bold text-sm text-foreground transition-all ${hideValues ? 'blur-sm select-none opacity-60' : ''}`}>
                                            {hideValues ? 'Max Mustermann' : (t.partnerName || 'Unbekannt')}
                                        </p>
                                        <p className="text-xs text-muted-foreground font-medium">{new Date(t.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-bold text-base tracking-tight transition-all ${hideValues ? 'blur-sm select-none opacity-60' : ''} ${t.type === 'sale' ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'}`}>
                                        {hideValues ? '99.99' : <>{t.type === 'sale' ? '+' : '-'}{t.totalGross.toFixed(2)}€</>}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div >
    );
}
