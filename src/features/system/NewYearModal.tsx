import React, { useState, useEffect, useCallback } from 'react';
import './NewYearModal.css';

interface NewYearModalProps {
    onClose: () => void;
}

const NewYearModal: React.FC<NewYearModalProps> = ({ onClose }) => {
    const [phase, setPhase] = useState(0);

    // Elegant phased reveal
    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 200),   // Year
            setTimeout(() => setPhase(2), 700),   // Line
            setTimeout(() => setPhase(3), 1100),  // Message
            setTimeout(() => setPhase(4), 1800),  // Hint
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    // Close handler with exit animation
    const handleClose = useCallback(() => {
        setPhase(5);
        setTimeout(onClose, 300);
    }, [onClose]);

    // Keyboard close
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (phase >= 3) handleClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [phase, handleClose]);

    return (
        <div
            className={`ny-overlay ${phase >= 5 ? 'exit' : ''}`}
            onClick={() => phase >= 3 && handleClose()}
        >
            <div className="ny-container">
                {/* Year */}
                <h1 className={`ny-year ${phase >= 1 ? 'visible' : ''}`}>
                    2026
                </h1>

                {/* Elegant divider */}
                <div className={`ny-line ${phase >= 2 ? 'visible' : ''}`} />

                {/* Message */}
                <p className={`ny-message ${phase >= 3 ? 'visible' : ''}`}>
                    Happy New Year
                </p>

                {/* Hint */}
                <span className={`ny-hint ${phase >= 4 ? 'visible' : ''}`}>
                    press any key
                </span>
            </div>
        </div>
    );
};

export default NewYearModal;
