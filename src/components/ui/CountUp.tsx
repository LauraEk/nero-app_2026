import { useEffect, useState } from 'react';

export function CountUp({ end, duration = 1000, prefix = '', suffix = '' }: { end: number, duration?: number, prefix?: string, suffix?: string }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        const start = 0;

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);

            // Ease out quart
            const ease = 1 - Math.pow(1 - progress, 4);

            setCount(start + (end - start) * ease);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [end, duration]);

    return <span>{prefix}{count.toFixed(2)}{suffix}</span>;
}
