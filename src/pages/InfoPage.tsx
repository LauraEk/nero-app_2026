import { ArrowLeft, BookOpen, Calculator, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function InfoPage() {
    return (
        <div className="max-w-2xl mx-auto pb-24 space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-border pb-4">
                <Link to="/settings" className="p-2 hover:bg-muted rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        Über die App <Info size={18} className="text-primary" />
                    </h2>
                </div>
            </div>

            {/* Intro Section */}
            <div className="bg-gradient-to-br from-primary/10 to-transparent p-6 rounded-2xl border border-primary/10">
                <h3 className="text-lg font-bold mb-2">Warum diese App?</h3>
                <p className="text-muted-foreground leading-relaxed">
                    Der An- und Verkauf von Sammelkarten (TCG) ist ein spezielles Geschäft.
                    Normale Buchhaltungs-Apps sind oft überladen oder verstehen die Besonderheiten wie die
                    <strong> Differenzbesteuerung</strong> nicht. <br /><br />
                    Diese App wurde <strong>von Sammlern für Sammler</strong> entwickelt, um den Papierkram so einfach wie möglich zu machen.
                </p>
            </div>

            {/* Features Grid */}
            <div className="grid gap-6">

                {/* Feature 1: Specialized Cashbook */}
                <div className="flex gap-4 p-4 bg-card rounded-xl border shadow-sm">
                    <div className="shrink-0 w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold mb-1">Digitales Kassenbuch</h4>
                        <p className="text-sm text-muted-foreground">
                            Erfasse deine Einnahmen und Ausgaben in Sekunden. Kein Zettelchaos mehr.
                            Alles ist digital, durchsuchbar und sicher gespeichert.
                        </p>
                    </div>
                </div>

                {/* Feature 2: Tax Logic */}
                <div className="flex gap-4 p-4 bg-card rounded-xl border shadow-sm">
                    <div className="shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-lg flex items-center justify-center">
                        <Calculator size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold mb-1">Steuer & §25a</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                            Das Herzstück für Händler: Die App unterscheidet automatisch zwischen:
                        </p>
                        <ul className="text-xs space-y-2 text-muted-foreground/90">
                            <li className="flex items-start gap-2">
                                <span className="bg-muted px-1.5 rounded text-[10px] font-mono border">Regel</span>
                                Klassische 19% MwSt (z.B. für Zubehör/Neuware).
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="bg-muted px-1.5 rounded text-[10px] font-mono border">§25a</span>
                                <strong>Differenzbesteuerung:</strong> Ideal für gebrauchte Karten von Privat. Du versteuerst nur deinen Gewinn (Marge), nicht den vollen Umsatz.
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Feature 3: Accountant Ready */}
                <div className="flex gap-4 p-4 bg-card rounded-xl border shadow-sm">
                    <div className="shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
                        <Briefcase size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold mb-1">Fertig für den Steuerberater</h4>
                        <p className="text-sm text-muted-foreground">
                            Kein langes Erklären mehr. Exportiere deine Listen als PDF (Belege) und gib sie deinem Steuerberater.
                            Die Trennung nach §25a und Regelbesteuerung ist bereits perfekt vorbereitet.
                        </p>
                    </div>
                </div>

                {/* Important: Data Security */}
                <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/50 rounded-xl">
                    <h4 className="font-bold text-amber-800 dark:text-amber-500 flex items-center gap-2 mb-2">
                        ⚠️ Wichtig: Datensicherheit
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                        <li>
                            <strong>Daten-Speicher:</strong> Alle deine Eingaben werden sicher <em>in deinem Browser</em> gespeichert. Wir haben keinen Zugriff darauf.
                        </li>
                        <li>
                            <strong>PDFs:</strong> Werden nicht gespeichert! Sie werden bei jedem Download neu erstellt. <br />
                            <span className="font-semibold text-foreground">Empfehlung:</span> Speichere deine PDF-Belege nach dem Download sofort in einer Cloud (Google Drive, iCloud, Dropbox) oder auf einer Festplatte.
                        </li>
                        <li>
                            <strong>Backup:</strong> Nutze regelmäßig die "Backup"-Funktion in den Einstellungen, besonders wenn du den Browser-Cache löschst oder das Gerät wechselst.
                        </li>
                    </ul>
                </div>

            </div>

            {/* Footer / Vision */}
            <div className="text-center pt-8 border-t border-border/50">
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-2">Developed for the Community</p>
                <p className="text-sm text-muted-foreground">
                    Mach dein Hobby zum Beruf – ohne Angst vor der Buchhaltung. 🚀
                </p>
            </div>
        </div>
    );
}

function Briefcase({ size, className }: { size?: number, className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
    )
}
