import { TransactionForm } from '@/features/transactions/components/TransactionForm';

export default function VerkaufPage() {
    return (
        <div className="max-w-2xl mx-auto">

            <TransactionForm type="sale" />
        </div>
    );
}
