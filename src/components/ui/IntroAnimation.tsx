import { useEffect, useState } from 'react';
import { useSettings } from '@/hooks/use-settings';

export function IntroAnimation({ onComplete }: { onComplete: () => void }) {
    const { settings } = useSettings();
    const [step, setStep] = useState(0); // 0: Pack/Card Back, 1: Flip/Reveal, 2: Exit

    useEffect(() => {
        // Sequence:
        // 0ms: Card Back appears (Pack effect)
        // 800ms: Card Flips to reveal Logo
        // 2500ms: Fade out
        // 3000ms: Complete

        const t1 = setTimeout(() => setStep(1), 800);
        const t2 = setTimeout(() => setStep(2), 2500);
        const t3 = setTimeout(onComplete, 3000);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, [onComplete]);

    return (
        <div
            className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-700 ease-in-out ${step === 2 ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
            style={{ perspective: '1000px' }}
        >
            <div className={`relative w-48 h-64 transition-transform duration-1000 transform-style-3d ${step >= 1 ? 'rotate-y-180' : ''
                }`}>
                {/* Card Back */}
                <div className="absolute inset-0 backface-hidden rounded-xl bg-gradient-to-br from-blue-600 to-indigo-900 border-4 border-white shadow-2xl flex items-center justify-center">
                    <div className="w-32 h-44 border-2 border-white/20 rounded-lg flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center animate-pulse">
                            <span className="text-white font-bold text-2xl">NERO</span>
                        </div>
                    </div>
                </div>

                {/* Card Front (Logo) */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-xl bg-card border border-border shadow-2xl flex flex-col items-center justify-center p-4">
                    {settings.logoUrl ? (
                        <img
                            src={settings.logoUrl}
                            alt="Logo"
                            className="w-full h-32 object-contain drop-shadow-md mb-4"
                        />
                    ) : (
                        <div className="text-4xl font-bold text-primary mb-4">You</div>
                    )}
                    <div className="text-center">
                        <h1 className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                            {settings.companyName || 'NERO'}
                        </h1>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Collectibles</p>
                    </div>
                    {/* Holo Effect Overlay */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-0 animate-shimmer pointer-events-none"></div>
                </div>
            </div>

            <style>{`
                .transform-style-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
                @keyframes shimmer {
                    0% { transform: translateX(-100%) translateY(-100%); opacity: 0; }
                    50% { opacity: 0.5; }
                    100% { transform: translateX(100%) translateY(100%); opacity: 0; }
                }
                .animate-shimmer {
                    animation: shimmer 1s ease-in-out 0.8s backwards;
                }
            `}</style>
        </div>
    );
}
