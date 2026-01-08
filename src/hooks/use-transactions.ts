import { useState, useEffect } from 'react';
import type { Transaction } from '@/types';

const STORAGE_KEY = 'nero_transactions';

export function useTransactions() {
    const [transactions, setTransactions] = useState<Transaction[]>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    }, [transactions]);

    const addTransaction = (transaction: Transaction) => {
        setTransactions(prev => [transaction, ...prev]);
    };

    const deleteTransaction = (id: string) => {
        setTransactions(prev => prev.filter(t => t.id !== id));
    };

    const importTransactions = (newTransactions: Transaction[]) => {
        setTransactions(newTransactions);
    };

    return {
        transactions,
        addTransaction,
        deleteTransaction,
        importTransactions
    };
}
