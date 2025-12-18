import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import './CodeBlock.css';

interface CodeBlockProps {
    language: string;
    value: string;
    children?: React.ReactNode;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, value, children }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="code-block">
            {/* Header with decorative corners */}
            <div className="code-block-header">
                <div className="code-header-left">
                    <span className="code-dot"></span>
                    <span className="code-dot"></span>
                    <span className="code-dot"></span>
                    <span className="code-language">{language.toUpperCase()}</span>
                </div>
                <button
                    onClick={handleCopy}
                    className={`copy-btn ${copied ? 'copied' : ''}`}
                    title="Copy code"
                >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copied ? 'COPIED' : 'COPY'}</span>
                </button>
            </div>

            {/* Code content */}
            <pre className={`code-pre language-${language}`}>
                <code className={`language-${language}`}>
                    {children || value}
                </code>
            </pre>
        </div>
    );
};

export default CodeBlock;
