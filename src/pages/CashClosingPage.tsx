import { useState, useMemo } from 'react';
import { useTransactions } from '@/hooks/use-transactions';
import { useSettings } from '@/hooks/use-settings';
import { Calculator, FileDown, Save } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function CashClosingPage() {
    const { transactions } = useTransactions();
    const { settings } = useSettings();

    // -- State for Manually Entered Data --
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [location, setLocation] = useState('');
    const [startBalance, setStartBalance] = useState<number | ''>('');
    const [endBalance, setEndBalance] = useState<number | ''>('');
    const [deposit, setDeposit] = useState<number | ''>(''); // Privateinlage
    const [withdrawal, setWithdrawal] = useState<number | ''>(''); // Privatentnahme
    const [notes, setNotes] = useState('');

    // -- Automatic Calculations --
    const dailyStats = useMemo(() => {
        // Filter: Selected Date AND Cash Payment
        const dailyTransactions = transactions.filter(t =>
            t.date === date && t.paymentMethod === 'cash'
        );

        let cashSales = 0;
        let cashPurchases = 0;

        dailyTransactions.forEach(t => {
            if (t.type === 'sale') {
                cashSales += t.totalGross;
            } else {
                cashPurchases += t.totalGross;
            }
        });

        return {
            cashSales,
            cashPurchases,
            count: dailyTransactions.length
        };
    }, [transactions, date]);

    // -- Calculated End Balance (Theoretical) --
    const calculatedEndBalance = useMemo(() => {
        const start = Number(startBalance) || 0;
        const dep = Number(deposit) || 0;
        const withdr = Number(withdrawal) || 0;
        return start + dailyStats.cashSales - dailyStats.cashPurchases + dep - withdr;
    }, [startBalance, dailyStats, deposit, withdrawal]);

    const difference = (Number(endBalance) || 0) - calculatedEndBalance;

    // -- PDF Export --
    const handleExportPDF = async () => {
        const doc = new jsPDF();

        // --- Header ---
        doc.setFontSize(10);
        doc.text(settings.companyName || 'NERO Collectibles', 14, 15);
        doc.text("Interner Tageskassenbericht", 14, 20);

        doc.setFontSize(18);
        doc.text("Kassenabschluss", 14, 30);

        doc.setFontSize(10);
        doc.text(`Datum: ${new Date(date).toLocaleDateString()}`, 14, 40);
        doc.text(`Ort / Event: ${location || 'Keine Angabe'}`, 14, 45);

        // --- Table ---
        const rows = [
            ["Kassenbestand Anfang", (Number(startBalance) || 0).toFixed(2) + " €"],
            ["+ Barverkäufe", dailyStats.cashSales.toFixed(2) + " €"],
            ["- Barankäufe", "-" + dailyStats.cashPurchases.toFixed(2) + " €"],
            ["+ Privateinlage", (Number(deposit) || 0).toFixed(2) + " €"],
            ["- Privatentnahme", "-" + (Number(withdrawal) || 0).toFixed(2) + " €"],
            // Divider row
            ["Rechnerischer Endbestand", calculatedEndBalance.toFixed(2) + " €"],
            ["Gezählter Endbestand (Ist)", (Number(endBalance) || 0).toFixed(2) + " €"],
            ["Differenz", difference.toFixed(2) + " €"]
        ];

        autoTable(doc, {
            head: [['Position', 'Betrag']],
            body: rows,
            startY: 55,
            theme: 'grid',
            headStyles: { fillColor: '#fbbe5e', textColor: '#000000' },
            columnStyles: {
                1: { halign: 'right', fontStyle: 'bold' }
            },
            didParseCell: (data) => {
                // Highlight Difference Row if not 0
                if (data.row.index === 7 && Math.abs(difference) > 0.01) {
                    data.cell.styles.textColor = '#ef4444'; // Red for diff
                }
            }
        });

        // Notes
        if (notes) {
            const finalY = (doc as any).lastAutoTable.finalY + 10;
            doc.text("Notizen:", 14, finalY);
            doc.setFont("helvetica", "italic");
            doc.text(notes, 14, finalY + 5);
        }

        // Footer / Disclaimer
        const pageHeight = doc.internal.pageSize.height;
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text("Dieser Bericht wurde automatisch erstellt und dient der internen Dokumentation.", 14, pageHeight - 20);
        doc.text("Unterschrift:", 130, pageHeight - 20);
        doc.line(130, pageHeight - 15, 190, pageHeight - 15);

        doc.save(`Kassenabschluss_${date}.pdf`);
    };

    return (
        <div className="space-y-6 pb-24">
            <div className="flex items-center gap-3 border-b border-border pb-4">
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                    <Calculator size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold">Kassenabschluss <span className="font-normal text-muted-foreground">erstellen</span></h2>
                    <p className="text-xs text-muted-foreground">Tagesbericht für Verkäufe & Ankäufe</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* 1. Basics Input */}
                <div className="space-y-4 bg-card p-4 rounded-lg border shadow-sm">
                    <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Rahmendaten</h3>

                    <div>
                        <label className="block text-sm font-medium mb-1">Datum</label>
                        <input
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            className="w-full p-2 border rounded bg-background"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Ort / Messe</label>
                        <input
                            type="text"
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                            placeholder="z.B. Card Show München"
                            className="w-full p-2 border rounded bg-background"
                        />
                    </div>
                </div>

                {/* 2. Cash Counts */}
                <div className="space-y-4 bg-card p-4 rounded-lg border shadow-sm">
                    <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Kassenbestand (Gezählt)</h3>

                    <div>
                        <label className="block text-sm font-medium mb-1">Bestand Anfang (Startgeld)</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={startBalance}
                                onChange={e => setStartBalance(e.target.value === '' ? '' : Number(e.target.value))}
                                className="w-full p-2 pl-8 border rounded bg-background"
                                placeholder="0.00"
                            />
                            <span className="absolute left-3 top-2 text-muted-foreground">€</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Bestand Ende (Abends)</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={endBalance}
                                onChange={e => setEndBalance(e.target.value === '' ? '' : Number(e.target.value))}
                                className="w-full p-2 pl-8 border rounded bg-background"
                                placeholder="0.00"
                            />
                            <span className="absolute left-3 top-2 text-muted-foreground">€</span>
                        </div>
                    </div>
                </div>

                {/* 3. Movements (Auto + Manual) */}
                <div className="space-y-4 bg-card p-4 rounded-lg border shadow-sm md:col-span-2">
                    <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Bewegungen</h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-muted/50 rounded flex justify-between items-center">
                            <span className="text-sm">Barverkäufe (Auto)</span>
                            <span className="font-mono font-bold text-green-600">+{dailyStats.cashSales.toFixed(2)} €</span>
                        </div>
                        <div className="p-3 bg-muted/50 rounded flex justify-between items-center">
                            <span className="text-sm">Barankäufe (Auto)</span>
                            <span className="font-mono font-bold text-orange-600">-{dailyStats.cashPurchases.toFixed(2)} €</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Privateinlage (+)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={deposit}
                                    onChange={e => setDeposit(e.target.value === '' ? '' : Number(e.target.value))}
                                    className="w-full p-2 pl-8 border rounded bg-background"
                                    placeholder="0.00"
                                />
                                <span className="absolute left-3 top-2 text-muted-foreground">€</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">z.B. Wechselgeld aufgefüllt</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Privatentnahme (-)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={withdrawal}
                                    onChange={e => setWithdrawal(e.target.value === '' ? '' : Number(e.target.value))}
                                    className="w-full p-2 pl-8 border rounded bg-background"
                                    placeholder="0.00"
                                />
                                <span className="absolute left-3 top-2 text-muted-foreground">€</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">z.B. Mittagessen bezahlt</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Notizen</label>
                        <textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            className="w-full p-2 border rounded bg-background h-20"
                            placeholder="Besonderheiten..."
                        />
                    </div>
                </div>

                {/* 4. Result & Action */}
                <div className="bg-card p-6 rounded-lg border shadow-sm md:col-span-2 flex flex-col items-center text-center space-y-4">
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Rechnerischer Soll-Bestand</p>
                        <p className="text-2xl font-bold">{calculatedEndBalance.toFixed(2)} €</p>
                    </div>

                    {startBalance !== '' && endBalance !== '' && (
                        <div className={`p-3 rounded w-full max-w-sm ${Math.abs(difference) < 0.01 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                            <div className="font-bold flex justify-between px-4">
                                <span>Differenz:</span>
                                <span>{difference > 0 ? '+' : ''}{difference.toFixed(2)} €</span>
                            </div>
                            {Math.abs(difference) > 0.01 && (
                                <p className="text-xs mt-1">Bitte prüfen! Kasse stimmt nicht überein.</p>
                            )}
                        </div>
                    )}

                    <button
                        onClick={handleExportPDF}
                        disabled={startBalance === '' || endBalance === ''}
                        className="w-full max-w-sm bg-primary text-primary-foreground py-3 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <FileDown size={20} />
                        Kassenabschluss als PDF erstellen
                    </button>
                    <p className="text-xs text-muted-foreground">Erstellt ein PDF für Ihre Unterlagen.</p>
                </div>
            </div>
        </div>
    );
}
