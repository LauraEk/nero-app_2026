import { TransactionForm } from '@/features/transactions/components/TransactionForm';

export default function AnkaufPage() {
    return (
        <div className="max-w-2xl mx-auto">

            <TransactionForm type="purchase" />
        </div>
    );
}
