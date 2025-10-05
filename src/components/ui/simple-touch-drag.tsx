import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GripVertical } from 'lucide-react';

interface SimpleTouchDragProps<T extends { id: string }> {
  items: T[];
  onReorder: (items: T[]) => void;
  children: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export function SimpleTouchDrag<T extends { id: string }>({ items, onReorder, children, className = '' }: SimpleTouchDragProps<T>) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchRef = useRef<HTMLDivElement>(null);
  
  // Use refs to track drag state for immediate access in event handlers
  const dragStateRef = useRef({
    draggedIndex: null as number | null,
    dragOverIndex: null as number | null,
    isDragging: false,
    touchStartY: 0
  });

  // Cleanup global event listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    const touch = e.touches[0];
    setTouchStartY(touch.clientY);
    setDraggedIndex(index);
    setIsDragging(true);
    e.preventDefault();
    e.stopPropagation();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || draggedIndex === null) return;
    
    const touch = e.touches[0];
    const deltaY = touch.clientY - touchStartY;
    const itemHeight = 80; // Approximate height of each item
    
    // Calculate which item we're hovering over
    const hoverIndex = Math.round(deltaY / itemHeight) + draggedIndex;
    const clampedIndex = Math.max(0, Math.min(items.length - 1, hoverIndex));
    
    setDragOverIndex(clampedIndex);
    e.preventDefault();
    e.stopPropagation();
  };

  const handleTouchEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      const newItems = [...items];
      const draggedItem = newItems[draggedIndex];
      
      // Remove from old position
      newItems.splice(draggedIndex, 1);
      // Insert at new position
      newItems.splice(dragOverIndex, 0, draggedItem);
      
      onReorder(newItems);
    }
    
    setDraggedIndex(null);
    setDragOverIndex(null);
    setIsDragging(false);
  };

  const handleMouseDown = (e: React.MouseEvent, index: number) => {
    console.log('Mouse down triggered on grip handle:', { index, clientY: e.clientY });
    
    // Update both state and ref
    setTouchStartY(e.clientY);
    setDraggedIndex(index);
    setIsDragging(true);
    
    // Update ref for immediate access
    dragStateRef.current = {
      draggedIndex: index,
      dragOverIndex: null,
      isDragging: true,
      touchStartY: e.clientY
    };
    
    e.preventDefault();
    e.stopPropagation();
    
    console.log('State set - draggedIndex:', index, 'isDragging: true');
    
    // Add global mouse event listeners for smoother dragging
    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);
    
    // Safety cleanup after 5 seconds to prevent stuck listeners
    setTimeout(() => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    }, 5000);
  };

  const handleGlobalMouseMove = (e: MouseEvent) => {
    const dragState = dragStateRef.current;
    
    if (!dragState.isDragging || dragState.draggedIndex === null) {
      return;
    }
    
    const deltaY = e.clientY - dragState.touchStartY;
    const itemHeight = 80;
    
    // Calculate target position based on drag distance
    let hoverIndex = dragState.draggedIndex;
    const dragThreshold = 30; // Minimum distance to trigger reorder
    
    if (Math.abs(deltaY) > dragThreshold) {
      // Calculate how many positions to move based on drag distance
      const positionsToMove = Math.floor(Math.abs(deltaY) / (itemHeight * 0.7)); // More sensitive
      
      if (deltaY > 0) {
        // Dragging down
        hoverIndex = Math.min(items.length - 1, dragState.draggedIndex + positionsToMove);
      } else {
        // Dragging up
        hoverIndex = Math.max(0, dragState.draggedIndex - positionsToMove);
      }
    }
    
    // Only update if position actually changed
    if (hoverIndex !== dragState.dragOverIndex) {
      dragState.dragOverIndex = hoverIndex;
      setDragOverIndex(hoverIndex);
    }
  };

  const handleGlobalMouseUp = () => {
    const dragState = dragStateRef.current;
    console.log('Mouse up:', { 
      draggedIndex: dragState.draggedIndex, 
      dragOverIndex: dragState.dragOverIndex, 
      shouldReorder: dragState.draggedIndex !== dragState.dragOverIndex 
    });
    
    // Remove global event listeners FIRST to prevent interference
    document.removeEventListener('mousemove', handleGlobalMouseMove);
    document.removeEventListener('mouseup', handleGlobalMouseUp);
    
    if (dragState.draggedIndex !== null && dragState.dragOverIndex !== null && dragState.draggedIndex !== dragState.dragOverIndex) {
      const newItems = [...items];
      const draggedItem = newItems[dragState.draggedIndex];
      
      console.log('Reordering from', dragState.draggedIndex, 'to', dragState.dragOverIndex);
      newItems.splice(dragState.draggedIndex, 1);
      newItems.splice(dragState.dragOverIndex, 0, draggedItem);
      
      onReorder(newItems);
    }
    
    // Reset both state and ref
    setDraggedIndex(null);
    setDragOverIndex(null);
    setIsDragging(false);
    
    dragStateRef.current = {
      draggedIndex: null,
      dragOverIndex: null,
      isDragging: false,
      touchStartY: 0
    };
  };

  const handleMouseMove = () => {
    // This is now handled by global mouse move for better performance
  };

  const handleMouseUp = () => {
    // This is now handled by global mouse up for better performance
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          ref={index === 0 ? touchRef : null}
          className="relative"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          animate={{
            y: draggedIndex === index && isDragging ? 0 : 0, // Keep dragged item in place
            zIndex: draggedIndex === index ? 50 : 1,
            scale: draggedIndex === index && isDragging ? 1.05 : 1,
            opacity: draggedIndex === index && isDragging ? 0.8 : 1,
          }}
          transition={{ 
            type: "spring", 
            stiffness: draggedIndex === index ? 400 : 300, 
            damping: 25,
            duration: isDragging ? 0.1 : 0.3
          }}
        >
          <div className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
            draggedIndex === index
              ? 'border-primary bg-primary-50 opacity-80'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}>
            <div className="flex items-center space-x-3 w-full">
              {/* Drag handle - ONLY for dragging */}
              <div 
                className={`drag-handle p-2 -m-2 touch-manipulation cursor-grab active:cursor-grabbing flex-shrink-0 rounded transition-colors ${
                  draggedIndex === index ? 'bg-primary-100' : 'hover:bg-gray-100'
                }`}
                onTouchStart={(e) => handleTouchStart(e, index)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={(e) => handleMouseDown(e, index)}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              >
                <GripVertical className={`h-5 w-5 transition-colors ${
                  draggedIndex === index ? 'text-primary-600' : 'text-gray-400'
                }`} />
              </div>
              
              {/* Clickable area for dealer selection - NO drag events */}
              <div 
                className="flex-1 cursor-pointer"
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
                onMouseMove={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
                onMouseDown={(e) => {
                  console.log('PLAYER CONTENT MOUSE DOWN:', e.target);
                  // Don't stop propagation - let click events through
                }}
              >
                {children(item, index)}
              </div>
            </div>
          </div>
          
          {/* Drop indicator */}
          <AnimatePresence>
            {dragOverIndex === index && draggedIndex !== index && (
              <motion.div
                className="absolute inset-0 border-2 border-primary border-dashed rounded-lg bg-primary-10"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}