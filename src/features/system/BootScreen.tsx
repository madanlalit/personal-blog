import React, { useState, useEffect } from 'react';
import './BootScreen.css';

const bootLines = [
    "BIOS Date 01/01/25 14:00:00 Ver: 1.0.2",
    "CPU: AMD Ryzen 9 5950X 16-Core Processor",
    "Memory: 65536MB OK",
    "Detecting Primary Master ... Maxtor 90432D3",
    "Detecting Primary Slave ... None",
    "Detecting Secondary Master ... HL-DT-ST GCE-8520B",
    "Booting from Hard Disk...",
    "Loading Kernel...",
    "[ OK ] Mounted tmpfs filesystem",
    "[ OK ] Started udev Kernel Device Manager",
    "[ OK ] Reached target System Initialization",
    "[ OK ] Started Login Service",
    "[ OK ] Reached target Multi-User System",
    "Welcome to BLOG-OS v2.0",
    "Initializing UI...",
    "..."
];

interface BootScreenProps {
    onComplete: () => void;
}

const BootScreen: React.FC<BootScreenProps> = ({ onComplete }) => {
    const [lines, setLines] = useState<string[]>([]);

    useEffect(() => {
        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex >= bootLines.length) {
                clearInterval(interval);
                setTimeout(onComplete, 800); // Small delay after last line
                return;
            }
            setLines(prev => [...prev, bootLines[currentIndex]]);
            currentIndex++;
        }, 150); // Speed of boot text

        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <div className="boot-screen">
            {lines.map((line, i) => (
                <div key={i} className="boot-line">{line}</div>
            ))}
            <div className="cursor-block"></div>
        </div>
    );
};

export default BootScreen;
