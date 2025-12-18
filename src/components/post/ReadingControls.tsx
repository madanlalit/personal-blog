import React, { useState, useEffect, useCallback } from 'react';
import { Type } from 'lucide-react';
import './ReadingControls.css';

const ReadingControls: React.FC = () => {
    const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>(() => {
        // Initialize from localStorage
        const saved = localStorage.getItem('reading-font-size') as 'small' | 'medium' | 'large' | null;
        return saved || 'medium';
    });

    const applyFontSize = useCallback((size: 'small' | 'medium' | 'large') => {
        const article = document.querySelector('.post-container');
        if (!article) return;

        article.classList.remove('font-small', 'font-medium', 'font-large');
        article.classList.add(`font-${size}`);
    }, []);

    // Apply font size on mount and when it changes
    useEffect(() => {
        applyFontSize(fontSize);
    }, [fontSize, applyFontSize]);

    const handleFontSizeChange = (size: 'small' | 'medium' | 'large') => {
        setFontSize(size);
        localStorage.setItem('reading-font-size', size);
    };

    return (
        <div className="reading-controls">
            <div className="control-group">
                <Type size={14} />
                <button
                    className={`control-btn ${fontSize === 'small' ? 'active' : ''}`}
                    onClick={() => handleFontSizeChange('small')}
                    title="Decrease font size"
                >
                    [A-]
                </button>
                <button
                    className={`control-btn ${fontSize === 'medium' ? 'active' : ''}`}
                    onClick={() => handleFontSizeChange('medium')}
                    title="Default font size"
                >
                    [A]
                </button>
                <button
                    className={`control-btn ${fontSize === 'large' ? 'active' : ''}`}
                    onClick={() => handleFontSizeChange('large')}
                    title="Increase font size"
                >
                    [A+]
                </button>
            </div>
        </div>
    );
};

export default ReadingControls;
