import React from 'react';
import { GripVertical, GripHorizontal } from 'lucide-react';

interface ResizableHandleProps {
  direction: 'horizontal' | 'vertical';
  onMouseDown: () => void;
  isResizing: boolean;
}

export function ResizableHandle({ direction, onMouseDown, isResizing }: ResizableHandleProps) {
  const isHorizontal = direction === 'horizontal';
  
  return (
    <div
      className={`
        ${isHorizontal ? 'w-1 h-full cursor-col-resize' : 'w-full h-1 cursor-row-resize'}
        bg-gray-300 dark:bg-gray-600 hover:bg-blue-500 dark:hover:bg-blue-400
        transition-colors duration-150 flex items-center justify-center group
        ${isResizing ? 'bg-blue-500 dark:bg-blue-400' : ''}
        relative
      `}
      onMouseDown={onMouseDown}
    >
      <div className={`
        ${isHorizontal ? 'w-3 h-8' : 'w-8 h-3'}
        bg-gray-400 dark:bg-gray-500 group-hover:bg-blue-600 dark:group-hover:bg-blue-300
        rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100
        transition-opacity duration-150
        ${isResizing ? 'opacity-100 bg-blue-600 dark:bg-blue-300' : ''}
      `}>
        {isHorizontal ? (
          <GripVertical size={12} className="text-white" />
        ) : (
          <GripHorizontal size={12} className="text-white" />
        )}
      </div>
    </div>
  );
}