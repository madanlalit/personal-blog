'use client';

import { useEffect, useState } from 'react';

const KONAMI_CODE = [
    'ArrowUp', 'ArrowUp',
    'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight',
    'ArrowLeft', 'ArrowRight',
    'b', 'a'
];

const useKonamiCode = (action: () => void) => {
    const [input, setInput] = useState<string[]>([]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const nextInput = [...input, e.key];
            if (nextInput.length > KONAMI_CODE.length) {
                nextInput.shift();
            }
            setInput(nextInput);

            if (nextInput.join('') === KONAMI_CODE.join('')) {
                action();
                setInput([]); // Reset after success
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [input, action]);
};

export default useKonamiCode;
