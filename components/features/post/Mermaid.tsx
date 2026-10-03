import React from 'react';
import { getPreRenderedDiagram } from '@/lib/diagrams';

interface MermaidProps {
    chart: string;
}

const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
    const svg = getPreRenderedDiagram(chart);

    if (svg) {
        return (
            <div
                className="mermaid-diagram"
                dangerouslySetInnerHTML={{ __html: svg }}
            />
        );
    }

    return (
        <div className="mermaid-diagram">
            <pre><code>{chart}</code></pre>
        </div>
    );
};

export default Mermaid;
