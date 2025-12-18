import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Hash } from 'lucide-react';
import './TableOfContents.css';

interface TOCItem {
    id: string;
    text: string;
    level: number;
}

const TableOfContents: React.FC = () => {
    const [headings, setHeadings] = useState<TOCItem[]>([]);
    const [activeId, setActiveId] = useState<string>('');
    const hasInitialized = useRef(false);

    const extractHeadings = useCallback(() => {
        const content = document.querySelector('.entry-content');
        if (!content) return [];

        const headingElements = content.querySelectorAll('h2, h3');
        const items: TOCItem[] = [];

        headingElements.forEach((heading, index) => {
            const id = `heading-${index}`;
            heading.id = id;

            // Add anchor link on hover (only if not already added)
            if (!heading.querySelector('.heading-anchor')) {
                const anchor = document.createElement('a');
                anchor.href = `#${id}`;
                anchor.className = 'heading-anchor';
                anchor.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>';
                heading.appendChild(anchor);
            }

            items.push({
                id,
                text: heading.textContent?.replace('#', '').trim() || '',
                level: parseInt(heading.tagName[1])
            });
        });

        return items;
    }, []);

    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        const items = extractHeadings();
        if (items.length > 0) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setHeadings(items);
        }

        // Track active heading on scroll
        const content = document.querySelector('.entry-content');
        if (!content) return;

        const headingElements = content.querySelectorAll('h2, h3');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-100px 0px -66%' }
        );

        headingElements.forEach((heading) => observer.observe(heading));

        return () => observer.disconnect();
    }, [extractHeadings]);

    if (headings.length < 3) return null;

    return (
        <nav className="table-of-contents">
            <div className="toc-header">
                <Hash size={14} />
                <span>CONTENTS</span>
            </div>
            <ul className="toc-list">
                {headings.map((heading) => (
                    <li
                        key={heading.id}
                        className={`toc-item level-${heading.level} ${activeId === heading.id ? 'active' : ''}`}
                    >
                        <a href={`#${heading.id}`}>{heading.text}</a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default TableOfContents;
