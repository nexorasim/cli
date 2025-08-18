import React, { useEffect, useRef } from 'react';

declare global {
    interface Window {
        mermaid: any;
    }
}

interface FlowchartProps {
    chart: string;
    id: string;
}

const Flowchart: React.FC<FlowchartProps> = ({ chart, id }) => {
    const componentRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (componentRef.current && window.mermaid) {
            // Clear previous render to avoid duplicates on HMR
            componentRef.current.innerHTML = '';
            
            try {
                 window.mermaid.render(id, chart, (svgCode: string) => {
                    if(componentRef.current) {
                        componentRef.current.innerHTML = svgCode;
                        const svg = componentRef.current.querySelector('svg');
                        if (svg) {
                            svg.style.maxWidth = '100%';
                            svg.style.height = 'auto';
                        }
                    }
                });
            } catch (e) {
                console.error("Mermaid rendering error:", e);
                if (componentRef.current) {
                    componentRef.current.innerHTML = `<p class="text-red-400">Error rendering flowchart.</p>`;
                }
            }
        }
    }, [chart, id]);

    return <div ref={componentRef} className="flex justify-center w-full" />;
};

export default Flowchart;