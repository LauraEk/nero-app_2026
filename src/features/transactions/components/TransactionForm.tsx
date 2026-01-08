import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Save, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import type { Transaction, TransactionItem, TransactionType } from '@/types';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '@/hooks/use-transactions';
import { SignaturePad, type SignaturePadRef } from '@/components/ui/SignaturePad';

interface TransactionFormProps {
    type: TransactionType;
}

export function TransactionForm({ type }: TransactionFormProps) {
    const navigate = useNavigate();
    const { addTransaction } = useTransactions();

    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [partnerName, setPartnerName] = useState('');
    const [partnerAddress, setPartnerAddress] = useState('');
    const [partnerEmail, setPartnerEmail] = useState('');
    const [taxMethod, setTaxMethod] = useState<'regular' | 'diff'>(type === 'sale' ? 'regular' : 'diff');
    const [items, setItems] = useState<TransactionItem[]>([
        { id: crypto.randomUUID(), name: '', quantity: 1, price: 0, taxRate: type === 'sale' ? 19 : 0 }
    ]);

    // Add ref for Signature Pad
    const sigPadRef = useRef<SignaturePadRef>(null);

    // Update default tax rates when method changes
    useEffect(() => {
        if (type === 'sale') {
            const newRate = taxMethod === 'diff' ? 0 : 19;
            setItems(items.map(item => ({ ...item, taxRate: newRate })));
        }
    }, [taxMethod]);

    const handleAddItem = () => {
        const defaultRate = type === 'sale' && taxMethod === 'regular' ? 19 : 0;
        setItems([
            ...items,
            { id: crypto.randomUUID(), name: '', quantity: 1, price: 0, taxRate: defaultRate }
        ]);
    };

    const handleRemoveItem = (id: string) => {
        if (items.length > 1) {
            setItems(items.filter(i => i.id !== id));
        }
    };

    const updateItem = (id: string, field: keyof TransactionItem, value: any) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const calculateTotals = () => {
        let totalGross = 0;
        let totalTax = 0;
        let totalNet = 0;

        items.forEach(item => {
            const lineGross = item.price * item.quantity;
            let net = lineGross;
            let tax = 0;

            if (type === 'sale' && taxMethod === 'regular') {
                // Regular Tax: Gross includes tax
                const rate = item.taxRate;
                net = lineGross / (1 + rate / 100);
                tax = lineGross - net;
            } else {
                // Diff Tax or Purchase (simplification): 
                // For Diff Tax, we don't calculate tax on the invoice itself.
                // The tax is internal on the margin, but the receipt shows no tax.
                net = lineGross;
                tax = 0;
            }

            totalGross += lineGross;
            totalNet += net;
            totalTax += tax;
        });

        return { totalGross, totalNet, totalTax };
    };

    const { totalGross, totalNet, totalTax } = calculateTotals();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!partnerName.trim()) {
            alert('Bitte Name angeben');
            return;
        }
        if (!partnerAddress.trim()) {
            alert('Bitte Adresse angeben (Pflichtfeld)');
            return;
        }

        // Capture signature if customized
        let sigData = '';
        if (sigPadRef.current && !sigPadRef.current.isEmpty()) {
            sigData = sigPadRef.current.toDataURL();
        }

        const transaction: Transaction = {
            id: crypto.randomUUID(),
            type,
            date,
            partnerName,
            partnerAddress,
            partnerEmail: partnerEmail.trim() || undefined,
            items,
            totalGross,
            totalNet,
            totalTax,
            taxMethod,
            signatureUrl: sigData || undefined
        };

        addTransaction(transaction);
        navigate('/');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pb-40">
            <div className="space-y-4 bg-card p-4 rounded-lg shadow-sm border border-border">
                <div className="flex items-center gap-3 border-b border-border pb-4">
                    {type === 'purchase' ? (
                        <div className="p-2 bg-primary/10 rounded-full text-primary">
                            <ArrowDownCircle size={24} />
                        </div>
                    ) : (
                        <div className="p-2 bg-primary/10 rounded-full text-primary">
                            <ArrowUpCircle size={24} />
                        </div>
                    )}
                    <div>
                        <h2 className="text-xl font-bold">{type === 'purchase' ? 'Ankauf' : 'Verkauf'} <span className="font-normal text-muted-foreground">erfassen</span></h2>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Datum</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full p-2 rounded-md border bg-background"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        {type === 'purchase' ? 'Verkäufer (Name)' : 'Käufer (Name)'} <span className="text-destructive">*</span>
                    </label>
                    <input
                        type="text"
                        value={partnerName}
                        onChange={(e) => setPartnerName(e.target.value)}
                        className="w-full p-2 rounded-md border bg-background"
                        placeholder="Max Mustermann"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        {type === 'purchase' ? 'Verkäufer (Adresse)' : 'Käufer (Adresse)'} <span className="text-destructive">*</span>
                    </label>
                    <textarea
                        value={partnerAddress}
                        onChange={(e) => setPartnerAddress(e.target.value)}
                        className="w-full p-2 rounded-md border bg-background h-24"
                        placeholder={`Straße Hausnummer\nPLZ Stadt\nLand`}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        E-Mail (Optional)
                    </label>
                    <input
                        type="email"
                        value={partnerEmail}
                        onChange={(e) => setPartnerEmail(e.target.value)}
                        className="w-full p-2 rounded-md border bg-background"
                        placeholder="max.mustermann@beispiel.de"
                    />
                </div>

                {/* Tax Method Selection */}
                <div>
                    <label className="block text-sm font-medium mb-2">Besteuerungsart</label>
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="taxMethod"
                                    value="regular"
                                    checked={taxMethod === 'regular'}
                                    onChange={() => setTaxMethod('regular')}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm">Regelbesteuerung (19%)</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="taxMethod"
                                    value="diff"
                                    checked={taxMethod === 'diff'}
                                    onChange={() => setTaxMethod('diff')}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm">Differenzbesteuerung (§25a)</span>
                            </label>
                        </div>
                        <p className="text-xs text-muted-foreground bg-muted p-2 rounded">
                            INFO: Wählen Sie <strong>Regel</strong> für Neuwaren/Zubehör. Wählen Sie <strong>§25a</strong> für gebrauchte Sammlerstücke (Ankauf von Privat).
                        </p>
                    </div>
                </div>

            </div>

            <div className="space-y-4">
                <h3 className="font-medium px-1">Positionen</h3>
                {items.map((item, index) => (
                    <div key={item.id} className="bg-card p-4 rounded-lg shadow-sm border border-border space-y-3 relative">
                        <div className="flex justify-between items-start">
                            <span className="text-xs text-muted-foreground">#{index + 1}</span>
                            {items.length > 1 && (
                                <button type="button" onClick={() => handleRemoveItem(item.id)} className="text-destructive">
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>

                        <div>
                            <input
                                type="text"
                                value={item.name}
                                onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                                placeholder="Artikelname (z.B. Lionel Messi, LM-010, PSA 10)"
                                className="w-full p-2 rounded-md border bg-background text-sm font-medium"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <label className="text-xs block mb-1">Menge</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                                    className="w-full p-2 rounded-md border bg-background text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-xs block mb-1">Preis (Brutto)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={item.price}
                                        onChange={(e) => updateItem(item.id, 'price', Number(e.target.value))}
                                        className="w-full p-2 rounded-md border bg-background text-sm pl-6"
                                    />
                                    <span className="absolute left-2 top-2 text-muted-foreground text-sm">€</span>
                                </div>
                            </div>

                            {/* Make tax calculation explicit - if regular, show select. If diff, show fixed. */}
                            <div>
                                <label className="text-xs block mb-1">Steuer</label>
                                <select
                                    value={item.taxRate}
                                    onChange={(e) => updateItem(item.id, 'taxRate', Number(e.target.value))}
                                    className="w-full p-2 rounded-md border bg-background text-sm"
                                    disabled={taxMethod === 'diff'} // Disable for Diff Tax
                                >
                                    <option value={19}>19%</option>
                                    <option value={7}>7%</option>
                                    <option value={0}>0%</option>
                                </select>
                            </div>
                        </div>
                        <div className="text-right text-xs text-muted-foreground">
                            Gesamt: {(item.price * item.quantity).toFixed(2)}€
                        </div>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={handleAddItem}
                    className="w-full py-3 border-2 border-dashed border-primary/20 rounded-lg flex items-center justify-center gap-2 text-primary hover:bg-primary/5 transition-colors font-medium"
                >
                    <Plus size={20} />
                    Position hinzufügen
                </button>
            </div>

            {/* Signature Section */}
            <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
                <h3 className="font-medium mb-2">Unterschrift ({type === 'purchase' ? 'Verkäufer' : 'Käufer'})</h3>
                <SignaturePad ref={sigPadRef} />
                <p className="text-xs text-muted-foreground mt-2">
                    {type === 'purchase'
                        ? 'Hiermit bestätige ich den Erhalt des oben genannten Betrags.'
                        : 'Hiermit bestätige ich den Erhalt der Ware.'}
                </p>
            </div>

            <div className="bg-card p-4 rounded-lg shadow-sm border border-border sticky bottom-28 z-40">
                <div className="space-y-1 mb-4 text-sm">
                    {/* Only show tax breakdown if it exists */}
                    {totalTax > 0 && (
                        <>
                            <div className="flex justify-between text-muted-foreground">
                                <span>Netto</span>
                                <span>{totalNet.toFixed(2)}€</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>MwSt</span>
                                <span>{totalTax.toFixed(2)}€</span>
                            </div>
                        </>
                    )}
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                        <span>Summe</span>
                        <span>{totalGross.toFixed(2)}€</span>
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-transform"
                >
                    <Save size={20} />
                    Speichern
                </button>
            </div>
        </form>
    );
}
