export type TransactionType = 'purchase' | 'sale';

export interface TransactionItem {
    id: string;
    name: string;
    quantity: number;
    price: number; // Single unit price
    taxRate: number; // e.g. 19 for 19%
}

export interface Transaction {
    id: string;
    type: TransactionType;
    date: string; // ISO string
    partnerName: string; // Buyer or components
    partnerAddress: string; // Mandatory address
    items: TransactionItem[];
    totalNet: number;
    totalTax: number;
    totalGross: number;
    notes?: string;
    taxMethod: 'regular' | 'diff';
    signatureUrl?: string; // Base64 signature image
    partnerEmail?: string; // Optional email for digital receipt
}
