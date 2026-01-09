'use client';

import React from 'react';
import { Share2, Twitter, Linkedin, Link as LinkIcon, Check } from 'lucide-react';
import './ShareButtons.css';

interface ShareButtonsProps {
    title: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ title }) => {
    const [copied, setCopied] = React.useState(false);
    const url = typeof window !== 'undefined' ? window.location.href : '';

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareData = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };

    return (
        <div className="share-buttons">
            <span className="share-label"><Share2 size={14} /> SHARE:</span>

            <a href={shareData.twitter} target="_blank" rel="noopener noreferrer" className="share-btn twitter" aria-label="Share on Twitter" title="Share on Twitter">
                <Twitter size={14} />
            </a>

            <a href={shareData.linkedin} target="_blank" rel="noopener noreferrer" className="share-btn linkedin" aria-label="Share on LinkedIn" title="Share on LinkedIn">
                <Linkedin size={14} />
            </a>

            <button onClick={handleCopy} className={`share-btn copy ${copied ? 'copied' : ''}`} aria-label="Copy link" title="Copy Link">
                {copied ? <Check size={14} /> : <LinkIcon size={14} />}
            </button>
        </div>
    );
};

export default ShareButtons;
