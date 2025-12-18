import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import './ShareButtons.css';

interface ShareButtonsProps {
    title: string;
    url?: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ title, url = window.location.href }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleTwitter = () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
    };

    const handleLinkedIn = () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    url
                });
            } catch {
                console.log('Share cancelled');
            }
        }
    };

    const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

    return (
        <div className="share-buttons">
            <button onClick={handleTwitter} className="share-btn">
                𝕏
            </button>
            <button onClick={handleLinkedIn} className="share-btn">
                in
            </button>
            <button onClick={handleCopy} className="share-btn">
                {copied ? <Check size={14} /> : 'LINK'}
            </button>
            {canShare && (
                <button onClick={handleNativeShare} className="share-btn">
                    <Share2 size={14} />
                </button>
            )}
        </div>
    );
};

export default ShareButtons;
