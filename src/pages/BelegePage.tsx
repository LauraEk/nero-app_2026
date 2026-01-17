import { useTransactions } from '@/hooks/use-transactions';
import { useSettings } from '@/hooks/use-settings';
import { FileDown, Trash2, Mail, Search, Filter, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useState } from 'react';

export default function BelegePage() {
    const { transactions, deleteTransaction } = useTransactions();
    const { settings } = useSettings();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'purchase' | 'sale'>('all');

    // 1. Sort transactions by date (oldest first) for consistent numbering
    const sortedTransactions = [...transactions].sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // 2. Helper to calculate dynamic ID
    const getTransactionId = (t: any) => {
        const typeList = sortedTransactions.filter(tr => tr.type === t.type);
        const index = typeList.findIndex(tr => tr.id === t.id);
        const year = t.date.split('-')[0];
        // User requested: A for Ankauf, V for Verkauf
        const prefix = t.type === 'sale' ? 'V' : 'A';
        // Pad to 4 digits, e.g. 0001
        const num = (index + 1).toString().padStart(4, '0');
        return `${prefix}-${year}-${num}`;
    };

    const handleSendEmail = (t: any) => {
        if (!t.partnerEmail) {
            alert('Keine E-Mail-Adresse für diesen Partner hinterlegt.');
            return;
        }

        const displayId = getTransactionId(t);
        const displayType = t.type === 'purchase' ? 'Gutschrift' : 'Rechnung';
        const displayTypeLong = t.type === 'purchase' ? 'Ankauf (Gutschrift)' : 'Verkauf (Rechnung)';

        const subject = encodeURIComponent(`Beleg NERO Collectibles: ${displayType} ${displayId}`);
        const body = encodeURIComponent(
            `Hallo ${t.partnerName},

anbei erhalten Sie den Beleg für unsere Transaktion vom ${new Date(t.date).toLocaleDateString()}.

Beleg-Nr: ${displayId}
Art: ${displayTypeLong}
Betrag: ${t.totalGross.toFixed(2)} €

Bitte generieren Sie das PDF aus der App und fügen es dieser E-Mail bei.

Mit freundlichen Grüßen,
${settings.companyName || 'NERO Collectibles'}`
        );

        window.open(`mailto:${t.partnerEmail}?subject=${subject}&body=${body}`);
    };

    const handleExportPDF = async (t: any) => {
        const doc = new jsPDF();
        const displayId = getTransactionId(t);

        // --- HEADER ---
        if (settings.logoUrl) {
            try {
                // Load image to get dimensions
                const img = new Image();
                img.src = settings.logoUrl;
                await new Promise((resolve) => {
                    img.onload = resolve;
                    img.onerror = resolve; // Continue even if fail
                });

                const maxWidth = 50; // mm
                const maxHeight = 30; // mm
                const ratio = img.width / img.height;

                let w = maxWidth;
                let h = w / ratio;

                if (h > maxHeight) {
                    h = maxHeight;
                    w = h * ratio;
                }

                doc.addImage(settings.logoUrl, 'JPEG', 14, 15, w, h);
            } catch (e) {
                console.error("Logo Error", e);
            }
        }

        // Company Info Block Right aligned
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(settings.companyName || 'NERO Collectibles', 200, 20, { align: 'right' });
        doc.setFont("helvetica", "normal");
        doc.text(settings.ownerName || '', 200, 25, { align: 'right' });

        const addressLines = (settings.address || '').split('\n');
        addressLines.forEach((line, i) => {
            doc.text(line, 200, 30 + (i * 5), { align: 'right' });
        });

        // Calculate Y position after address
        const nextY = 30 + (Math.max(addressLines.length, 1) * 5);

        doc.text(settings.email || '', 200, nextY + 5, { align: 'right' });
        doc.text(settings.website || '', 200, nextY + 10, { align: 'right' });
        doc.text(`USt-ID: ${settings.taxId || '-'}`, 200, nextY + 15, { align: 'right' });

        // --- TITLE & METADATA ---
        doc.setFontSize(18);
        doc.text(t.type === 'sale' ? 'Rechnung' : 'Gutschrift / Ankaufbeleg', 14, 70);

        doc.setFontSize(10);
        doc.text(`Beleg-Nr: ${displayId}`, 14, 80);
        doc.text(`Datum: ${t.date}`, 14, 85);

        // Payment Method Map
        const paymentMap: Record<string, string> = {
            'cash': 'Barzahlung',
            'paypal': 'PayPal',
            'bank': 'Banküberweisung'
        };
        const method = t.paymentMethod || 'cash';
        const paymentLabel = paymentMap[method] || 'Barzahlung';

        const partnerLabel = t.type === 'sale' ? 'Kunde' : 'Verkäufer';
        doc.text(`Zahlungsart: ${paymentLabel}`, 14, 90);
        doc.text(`${partnerLabel}: ${t.partnerName || '-'}`, 14, 100);

        // Partner Address (multiline)
        if (t.partnerAddress) {
            const splitAddress = doc.splitTextToSize(t.partnerAddress, 70);
            doc.text(splitAddress, 14, 105);
        }

        // --- TABLE ---
        const isDiffTax = t.taxMethod === 'diff';

        // Define columns based on tax method
        const tableColumn = isDiffTax
            ? ["Pos", "Artikel", "Menge", "Einzelpreis", "Gesamt"]
            : ["Pos", "Artikel", "Menge", "Netto", "MwSt", "Brutto"];

        const tableRows: any[] = [];

        t.items.forEach((item: any, index: number) => {
            const gross = item.price * item.quantity;

            if (isDiffTax) {
                tableRows.push([
                    index + 1,
                    item.name,
                    item.quantity,
                    item.price.toFixed(2) + ' €',
                    gross.toFixed(2) + ' €'
                ]);
            } else {
                const net = gross / (1 + item.taxRate / 100);
                tableRows.push([
                    index + 1,
                    item.name,
                    item.quantity,
                    net.toFixed(2) + ' €',
                    item.taxRate + '%',
                    gross.toFixed(2) + ' €'
                ]);
            }
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 100,
            headStyles: {
                fillColor: '#fbbe5e',
                textColor: '#000000', // Ensuring readability on light background
            },
        });

        // --- TOTALS ---
        let finalY = (doc as any).lastAutoTable.finalY + 10;
        const rightX = 180; // Right align totals

        if (isDiffTax) {
            // For diff tax, only show total amount
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text(`Gesamtbetrag: ${t.totalGross.toFixed(2)} €`, rightX, finalY, { align: 'right' });

            // Legal Note for Diff Tax
            doc.setFontSize(8);
            doc.setFont("helvetica", "normal");
            doc.text("Gebrauchtgegenstände/Sonderregelung: Differenzbesteuerung (§25a UStG). Die Umsatzsteuer ist im Kaufpreis enthalten, wird jedoch nicht gesondert ausgewiesen.", 14, finalY + 10, { maxWidth: 180 });
            finalY += 20; // Adjust finalY for the legal note
        } else {
            doc.text(`Netto Gesamt: ${t.totalNet.toFixed(2)} €`, rightX, finalY, { align: 'right' });
            doc.text(`MwSt Gesamt: ${t.totalTax.toFixed(2)} €`, rightX, finalY + 5, { align: 'right' });

            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text(`Gesamtbetrag: ${t.totalGross.toFixed(2)} €`, rightX, finalY + 12, { align: 'right' });
            finalY += 12; // Adjust finalY for the totals
        }

        // --- SIGNATURE SECTION ---
        finalY = finalY + 10; // Add some space after totals/legal note

        // Confirmation Text
        doc.setFontSize(10);
        const confirmText = t.type === 'purchase'
            ? 'Bestätigung: Geld erhalten'
            : 'Bestätigung: Ware erhalten';
        doc.text(confirmText, 14, finalY + 10);

        // Signature Line or Image
        if (t.signatureUrl) {
            // Add signature image
            try {
                doc.addImage(t.signatureUrl, 'PNG', 14, finalY + 15, 60, 30);
                // Add line below image for aesthetics
                doc.line(14, finalY + 45, 80, finalY + 45);
            } catch (e) {
                console.error("Error adding signature to PDF", e);
                // Fallback if image fails
                doc.line(14, finalY + 30, 80, finalY + 30);
            }
        } else {
            // Empty line for manual signature
            doc.line(14, finalY + 30, 80, finalY + 30);
        }

        doc.setFontSize(8);
        const signLabel = `Ort, Datum, Unterschrift (${t.type === 'purchase' ? 'Verkäufer' : 'Käufer'})`;
        doc.text(signLabel, 14, finalY + (t.signatureUrl ? 50 : 35));

        doc.save(`${displayId}.pdf`);
    };

    // Filter for display
    const filteredTransactions = sortedTransactions.filter(t => {
        const matchesSearch = t.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.id.includes(searchTerm);
        const matchesFilter = filterType === 'all' || t.type === filterType;
        return matchesSearch && matchesFilter;
    });

    // We reverse the list FOR DISPLAY to show newest first, 
    // but the ID generation relied on the oldest-first 'sortedTransactions'
    const displayList = [...filteredTransactions].reverse();

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-border pb-4">
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                    <FileText size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold">Belege <span className="font-normal text-muted-foreground">verwalten</span></h2>
                </div>
            </div>

            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 text-muted-foreground" size={18} />
                    <input
                        type="text"
                        placeholder="Suchen..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-8 p-2 rounded-md border bg-background"
                    />
                </div>
                <button
                    onClick={() => setFilterType(current => {
                        if (current === 'all') return 'sale';
                        if (current === 'sale') return 'purchase';
                        return 'all';
                    })}
                    className="p-2 border rounded-md bg-card hover:bg-muted min-w-[40px] flex items-center justify-center"
                >
                    <Filter size={18} />
                    <span className="ml-1 text-xs uppercase font-bold">{filterType === 'all' ? 'Alle' : filterType === 'sale' ? 'V' : 'A'}</span>
                </button>
            </div>

            <div className="space-y-4">
                {displayList.map(t => {
                    const displayId = getTransactionId(t);
                    return (
                        <div key={t.id} className="bg-card p-4 rounded-lg border shadow-sm flex flex-col gap-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="font-bold flex items-center gap-2">
                                        {t.type === 'sale' ? 'Verkauf (V)' : 'Ankauf (A)'}
                                        <span className="text-xs font-normal text-muted-foreground bg-muted px-1 rounded">
                                            {displayId}
                                        </span>
                                    </div>
                                    <div className="text-sm text-muted-foreground">{t.date} | {t.partnerName}</div>
                                </div>
                                <div className="font-bold">
                                    {t.totalGross.toFixed(2)}€
                                </div>
                            </div>

                            <div className="text-sm bg-muted p-2 rounded">
                                {t.items.map((item: any, i: number) => (
                                    <div key={i} className="flex justify-between">
                                        <span>{item.quantity}x {item.name}</span>
                                        <span>{(item.quantity * item.price).toFixed(2)}€</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t">
                                <button
                                    onClick={() => deleteTransaction(t.id)}
                                    className="p-2 text-destructive hover:bg-destructive/10 rounded"
                                    title="Löschen"
                                >
                                    <Trash2 size={18} />
                                </button>

                                {t.partnerEmail && (
                                    <button
                                        onClick={() => handleSendEmail(t)}
                                        className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 px-3 py-2 rounded-md hover:bg-blue-100 transition-colors border border-blue-200"
                                        title="E-Mail öffnen"
                                    >
                                        <Mail size={16} />
                                        E-Mail
                                    </button>
                                )}

                                <button
                                    onClick={() => handleExportPDF(t)}
                                    className="flex items-center gap-1 text-sm bg-secondary text-secondary-foreground px-3 py-2 rounded-md hover:bg-secondary/80 transition-colors"
                                >
                                    <FileDown size={16} />
                                    PDF
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            {displayList.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                    Keine Belege gefunden.
                </div>
            )}
        </div>
    );
}
