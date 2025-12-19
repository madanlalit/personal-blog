import React, { useState, useEffect } from 'react';
import './BootScreen.css';

const biosLines = [
    "American Megatrends BIOS v1.0.2",
    "Copyright (C) 2025, AMT Inc.",
    "",
    "BIOS Date: 12/18/25    CPU: AMD Ryzen 9 5950X    Speed: 3.4 GHz",
    "",
    "Press DEL to run Setup, F11 for Boot Menu",
    "",
    "Testing memory...",
    "65536 MB OK",
    "",
    "Detecting drives:",
    "  Primary Master   : Maxtor 90432D3    [OK]",
    "  Primary Slave    : None              [-]",
    "  Secondary Master : HL-DT-ST DVD-ROM  [OK]",
    "",
    "POST Complete - No Errors Found",
    "",
    "Booting BLOG-OS v2.0...",
    "Loading kernel modules... [████████░░] 80%",
    "Initializing system... DONE",
    "Mounting filesystems... OK",
    "Starting services... OK",
    "",
    "System ready."
];

interface BootScreenProps {
    onComplete: () => void;
}

const BootScreen: React.FC<BootScreenProps> = ({ onComplete }) => {
    const [lines, setLines] = useState<string[]>([]);

    useEffect(() => {
        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex >= biosLines.length) {
                clearInterval(interval);
                setTimeout(onComplete, 200);
                return;
            }
            setLines(prev => [...prev, biosLines[currentIndex]]);
            currentIndex++;
        }, 40); // Even faster boot sequence

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
