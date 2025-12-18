import React, { useState } from 'react';
import { Share2, Check, X, Linkedin, Link2 } from 'lucide-react';
import './ShareButtons.css';

interface ShareButtonsProps {
    title: string;
    url?: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ title, url = window.location.href }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const handleTwitter = () => {
        window.open(`https://x.com/shareintent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer');
    };

    const handleLinkedIn = () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer');
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    url
                });
            } catch (err) {
                if ((err as Error).name !== 'AbortError') {
                    console.error('Share failed:', err);
                }
            }
        }
    };

    const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

    return (
        <div className="share-buttons-container">
            <span className="share-label">SHARE:</span>
            <div className="share-buttons">
                <button
                    onClick={handleTwitter}
                    className="share-btn"
                    title="Share on X (Twitter)"
                    aria-label="Share on X (Twitter)"
                >
                    < X size={16} />
                </button>
                <button
                    onClick={handleLinkedIn}
                    className="share-btn"
                    title="Share on LinkedIn"
                    aria-label="Share on LinkedIn"
                >
                    <Linkedin size={16} />
                </button>
                <button
                    onClick={handleCopy}
                    className={`share-btn ${copied ? 'copied' : ''}`}
                    title="Copy Link"
                    aria-label="Copy Link"
                >
                    {copied ? <Check size={16} /> : <Link2 size={16} />}
                </button>
                {canShare && (
                    <button
                        onClick={handleNativeShare}
                        className="share-btn"
                        title="More Share Options"
                        aria-label="More Share Options"
                    >
                        <Share2 size={16} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default ShareButtons;
