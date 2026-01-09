import React, { useState, useEffect } from 'react';

interface TypewriterContentProps {
    content: string;
    speed?: number; // ms per char
}

const TypewriterContent: React.FC<TypewriterContentProps> = ({ content, speed = 10 }) => {
    const [visibleBlocks, setVisibleBlocks] = useState<number>(0);
    const [currentBlockProgress, setCurrentBlockProgress] = useState<number>(0);
    const [isSkipped, setIsSkipped] = useState(false);

    // Parse content into blocks first
    const blocks = React.useMemo(() => content.split('\n\n'), [content]);

    useEffect(() => {
        if (isSkipped) return;

        // If all blocks shown, stop
        if (visibleBlocks >= blocks.length) return;

        const currentBlockText = blocks[visibleBlocks];

        // If current block is fully shown, move to next
        if (currentBlockProgress >= currentBlockText.length) {
            const timeout = setTimeout(() => {
                setVisibleBlocks(prev => prev + 1);
                setCurrentBlockProgress(0);
            }, 300); // Small pause between paragraphs
            return () => clearTimeout(timeout);
        }

        // Typer
        const timeout = setTimeout(() => {
            setCurrentBlockProgress(prev => prev + 1);
        }, speed);

        return () => clearTimeout(timeout);
    }, [visibleBlocks, currentBlockProgress, blocks, isSkipped, speed]);

    // Keyboard listener for Skip (Space)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' && !isSkipped) {
                e.preventDefault();
                setIsSkipped(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isSkipped]);

    // Renderer
    const renderBlock = (block: string, index: number) => {
        // Determine text to show
        let textToShow = block;
        let isTyping = false;

        if (!isSkipped) {
            if (index > visibleBlocks) return null; // Future block
            if (index === visibleBlocks) {
                textToShow = block.slice(0, currentBlockProgress);
                isTyping = true;
            }
        }

        // Determine Tag type
        let Tag: React.ElementType = 'p';
        let contentText = textToShow;
        const className = '';

        if (block.startsWith('## ')) {
            Tag = 'h2';
            contentText = textToShow.replace('## ', '');
        } else if (block.startsWith('### ')) {
            Tag = 'h3';
            contentText = textToShow.replace('### ', '');
        } else if (block.startsWith('> ')) {
            Tag = 'blockquote';
            contentText = textToShow.replace('> ', '');
        }

        return (
            <Tag key={index} className={className}>
                {contentText}
                {isTyping && <span className="cursor-block">█</span>}
            </Tag>
        );
    };

    return (
        <div className="typewriter-content">
            {!isSkipped && visibleBlocks < blocks.length && (
                <div className="skip-hint">[PRESS SPACE TO SKIP]</div>
            )}
            {blocks.map((block, i) => renderBlock(block, i))}
        </div>
    );
};

export default TypewriterContent;
