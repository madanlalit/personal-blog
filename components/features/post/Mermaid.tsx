'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
    chart: string;
}

const Mermaid = ({ chart }: MermaidProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [svg, setSvg] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const renderChart = useCallback(async () => {
        // Read the live CSS variables from the document
        const style = getComputedStyle(document.documentElement);
        const bgPrimary = style.getPropertyValue('--bg-primary').trim() || '#18191A';
        const bgSecondary = style.getPropertyValue('--bg-secondary').trim() || '#202224';
        const textPrimary = style.getPropertyValue('--text-primary').trim() || '#D4D4D4';
        const textSecondary = style.getPropertyValue('--text-secondary').trim() || '#8B949E';
        const accent = style.getPropertyValue('--accent').trim() || '#A8B9A8';
        const border = style.getPropertyValue('--border').trim() || '#3E4451';

        // theme: 'base' gives us full control over all colors
        mermaid.initialize({
            startOnLoad: false,
            theme: 'base',
            themeVariables: {
                // Node backgrounds — use page bg so shapes are clean
                primaryColor: bgPrimary,
                secondaryColor: bgPrimary,
                tertiaryColor: bgPrimary,
                mainBkg: bgPrimary,
                nodeBorder: textPrimary,

                // Text colors
                primaryTextColor: textPrimary,
                secondaryTextColor: textSecondary,
                tertiaryTextColor: textSecondary,
                nodeTextColor: textPrimary,
                titleColor: textPrimary,

                // Line and edge colors
                primaryBorderColor: textPrimary,
                lineColor: textPrimary,
                edgeLabelBackground: bgPrimary,

                // Cluster (subgraph) colors — slightly offset for grouping
                clusterBkg: bgSecondary,
                clusterBorder: border,

                // Font
                fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                fontSize: '13px',

                // Page background
                background: bgPrimary,
            },
            flowchart: {
                htmlLabels: true,
                curve: 'basis',
                padding: 20,
                nodeSpacing: 40,
                rankSpacing: 50,
            },
            securityLevel: 'loose',
        });

        try {
            const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
            const { svg: renderedSvg } = await mermaid.render(id, chart.trim());
            setSvg(renderedSvg);
            setError(null);
        } catch (err) {
            setError(String(err));
            console.error('Mermaid render error:', err);
        }
    }, [chart]);

    useEffect(() => {
        renderChart();

        // Re-render when theme changes
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.attributeName === 'data-theme') {
                    renderChart();
                    break;
                }
            }
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme'],
        });

        return () => observer.disconnect();
    }, [renderChart]);

    if (error) {
        return (
            <div className="mermaid-error">
                <pre>{chart}</pre>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="mermaid-diagram"
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
};

export default Mermaid;
