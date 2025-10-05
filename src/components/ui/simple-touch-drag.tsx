import React, { useState, useRef } from 'react';
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

  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    const touch = e.touches[0];
    setTouchStartY(touch.clientY);
    setDraggedIndex(index);
    setIsDragging(true);
    e.preventDefault();
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
    setTouchStartY(e.clientY);
    setDraggedIndex(index);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || draggedIndex === null) return;
    
    const deltaY = e.clientY - touchStartY;
    const itemHeight = 80;
    
    const hoverIndex = Math.round(deltaY / itemHeight) + draggedIndex;
    const clampedIndex = Math.max(0, Math.min(items.length - 1, hoverIndex));
    
    setDragOverIndex(clampedIndex);
  };

  const handleMouseUp = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      const newItems = [...items];
      const draggedItem = newItems[draggedIndex];
      
      newItems.splice(draggedIndex, 1);
      newItems.splice(dragOverIndex, 0, draggedItem);
      
      onReorder(newItems);
    }
    
    setDraggedIndex(null);
    setDragOverIndex(null);
    setIsDragging(false);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          ref={index === 0 ? touchRef : null}
          className="relative"
          onTouchStart={(e) => handleTouchStart(e, index)}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={(e) => handleMouseDown(e, index)}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          animate={{
            y: draggedIndex === index && isDragging ? (dragOverIndex || 0) * 80 : 0,
            zIndex: draggedIndex === index ? 50 : 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all cursor-move touch-manipulation ${
            draggedIndex === index
              ? 'border-primary bg-primary-50 opacity-80'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}>
            <div className="flex items-center space-x-3">
              {/* Drag handle */}
              <div className="p-2 -m-2 touch-manipulation">
                <GripVertical className="h-5 w-5 text-gray-400" />
              </div>
              {children(item, index)}
            </div>
          </div>
          
          {/* Drop indicator */}
          <AnimatePresence>
            {dragOverIndex === index && draggedIndex !== index && (
              <motion.div
                className="absolute inset-0 border-2 border-primary border-dashed rounded-lg bg-primary-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
