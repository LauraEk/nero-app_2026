import { useRef } from 'react';
import { useSettings } from '@/hooks/use-settings';
import { Upload, Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
    const { settings, updateSettings } = useSettings();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateSettings({ logoUrl: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="max-w-2xl mx-auto pb-24">
            <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                    <SettingsIcon size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold">Einstellungen <span className="font-normal text-muted-foreground">verwalten</span></h2>
                </div>
            </div>

            <div className="space-y-6">
                {/* Logo Section */}
                <div className="bg-card p-4 rounded-lg border shadow-sm space-y-4">
                    <h2 className="font-semibold">Logo (für PDF)</h2>
                    <div className="flex items-center gap-4">
                        <div className="w-24 h-24 border rounded flex items-center justify-center bg-muted overflow-hidden">
                            {settings.logoUrl ? (
                                <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                            ) : (
                                <span className="text-xs text-muted-foreground p-2 text-center">Kein Logo</span>
                            )}
                        </div>
                        <div>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleLogoUpload}
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 px-3 py-2 bg-secondary rounded text-sm font-medium hover:bg-secondary/80"
                            >
                                <Upload size={16} />
                                Bild hochladen
                            </button>
                            <p className="text-xs text-muted-foreground mt-2">Empfohlen: Hochkant, transparent, max 500kb</p>
                        </div>
                    </div>
                </div>

                {/* App Design */}
                <div className="bg-card p-4 rounded-lg border shadow-sm space-y-4">
                    <h2 className="font-semibold">App Design</h2>
                    <div>
                        <label className="block text-sm font-medium mb-1">Hauptfarbe</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={settings.primaryColor || '#0f172a'}
                                onChange={(e) => updateSettings({ primaryColor: e.target.value })}
                                className="h-10 w-20 p-1 rounded border cursor-pointer"
                            />
                            <span className="text-sm text-muted-foreground">
                                {settings.primaryColor || '#0f172a'}
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Erscheinungsbild</label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => updateSettings({ theme: 'light' })}
                                className={`p-3 rounded-lg border text-sm font-medium flex flex-col items-center gap-2 transition-all ${settings.theme === 'light'
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'hover:bg-muted'
                                    }`}
                            >
                                <span className="text-xl">☀️</span>
                                Hell
                            </button>
                            <button
                                onClick={() => updateSettings({ theme: 'dark' })}
                                className={`p-3 rounded-lg border text-sm font-medium flex flex-col items-center gap-2 transition-all ${settings.theme === 'dark'
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'hover:bg-muted'
                                    }`}
                            >
                                <span className="text-xl">🌙</span>
                                Dunkel
                            </button>
                            <button
                                onClick={() => updateSettings({ theme: 'system' })}
                                className={`p-3 rounded-lg border text-sm font-medium flex flex-col items-center gap-2 transition-all ${settings.theme === 'system'
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'hover:bg-muted'
                                    }`}
                            >
                                <span className="text-xl">💻</span>
                                System
                            </button>
                        </div>
                    </div>
                </div>

                {/* Company Data */}
                <div className="bg-card p-4 rounded-lg border shadow-sm space-y-4">
                    <h2 className="font-semibold">Firmendaten</h2>

                    <div>
                        <label className="block text-sm font-medium mb-1">Firmenname</label>
                        <input
                            type="text"
                            value={settings.companyName}
                            onChange={(e) => updateSettings({ companyName: e.target.value })}
                            className="w-full p-2 rounded-md border bg-background"
                            placeholder="Musterfirma GmbH"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Inhaber</label>
                        <input
                            type="text"
                            value={settings.ownerName}
                            onChange={(e) => updateSettings({ ownerName: e.target.value })}
                            className="w-full p-2 rounded-md border bg-background"
                            placeholder="Max Mustermann"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Anschrift</label>
                        <textarea
                            value={settings.address}
                            onChange={(e) => updateSettings({ address: e.target.value })}
                            className="w-full p-2 rounded-md border bg-background h-20"
                            placeholder="Musterstraße 1&#10;12345 Musterstadt"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">E-Mail</label>
                        <input
                            type="email"
                            value={settings.email}
                            onChange={(e) => updateSettings({ email: e.target.value })}
                            className="w-full p-2 rounded-md border bg-background"
                            placeholder="info@musterfirma.de"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Website</label>
                        <input
                            type="url"
                            value={settings.website}
                            onChange={(e) => updateSettings({ website: e.target.value })}
                            className="w-full p-2 rounded-md border bg-background"
                            placeholder="www.muster-unternehmen.de"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Umsatzsteuer-ID</label>
                        <input
                            type="text"
                            value={settings.taxId}
                            onChange={(e) => updateSettings({ taxId: e.target.value })}
                            className="w-full p-2 rounded-md border bg-background"
                            placeholder="DE123456789"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
