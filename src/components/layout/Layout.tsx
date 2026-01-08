import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export function Layout() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans antialiased">
            <main className="container mx-auto p-4 pb-20 md:pb-4">
                <Outlet />
            </main>
            <BottomNav />
        </div>
    );
}
