import React from 'react';

interface TooltipProps {
    text: string;
    children: React.ReactNode;
    position?: 'top' | 'bottom';
}

const Tooltip: React.FC<TooltipProps> = ({ text, children, position = 'top' }) => (
    <div className="relative group/tip inline-flex">
        {children}
        <div
            className={`
        pointer-events-none absolute left-1/3 -translate-x-1/2 z-[9999]
        px-2 py-1 bg-[#1a1a1a] text-white text-[11px] font-medium rounded-md whitespace-nowrap
        opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150
        ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}
      `}
        >
            {text}
            {/* Arrow */}
            <span
                className={`absolute left-1/2 -translate-x-1/2 border-4 border-transparent
          ${position === 'top' ? 'top-full border-t-[#1a1a1a]' : 'bottom-full border-b-[#1a1a1a]'}
        `}
            />
        </div>
    </div>
);

export default Tooltip;
