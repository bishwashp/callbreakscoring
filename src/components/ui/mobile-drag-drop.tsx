import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { GripVertical } from 'lucide-react';

interface DragDropItemProps {
  id: string;
  children: React.ReactNode;
  isSelected?: boolean;
  onClick?: () => void;
}

export function DragDropItem({ id, children, isSelected = false, onClick }: DragDropItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all cursor-move touch-manipulation ${
        isSelected
          ? 'border-primary bg-primary-50'
          : 'border-gray-200 hover:border-gray-300'
      } ${isDragging ? 'opacity-50 z-50' : ''}`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      <div className="flex items-center space-x-3">
        {/* Drag handle - optimized for touch */}
        <div
          className="p-2 -m-2 touch-manipulation"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5 text-gray-400" />
        </div>
        {children}
      </div>
    </motion.div>
  );
}

interface MobileDragDropProps<T extends { id: string }> {
  items: T[];
  onReorder: (items: T[]) => void;
  children: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export function MobileDragDrop<T extends { id: string }>({ items, onReorder, children, className = '' }: MobileDragDropProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px of movement before drag starts (prevents accidental drags)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      onReorder(newItems);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map(item => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className={`space-y-3 ${className}`}>
          {items.map((item, index) => (
            <DragDropItem key={item.id} id={item.id}>
              {children(item, index)}
            </DragDropItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

// Alternative: Simple touch-based drag without @dnd-kit for lighter weight
interface TouchDragItemProps {
  children: React.ReactNode;
  isSelected?: boolean;
  onClick?: () => void;
  onDragStart?: () => void;
  onDragMove?: (deltaY: number) => void;
  onDragEnd?: () => void;
}

export function TouchDragItem({ 
  children, 
  isSelected = false, 
  onClick,
  onDragStart,
  onDragMove,
  onDragEnd
}: TouchDragItemProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [startY, setStartY] = React.useState(0);
  const [currentY, setCurrentY] = React.useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setStartY(touch.clientY);
    setCurrentY(touch.clientY);
    setIsDragging(true);
    onDragStart?.();
    e.preventDefault();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const deltaY = touch.clientY - startY;
    setCurrentY(touch.clientY);
    onDragMove?.(deltaY);
    e.preventDefault();
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    onDragEnd?.();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setStartY(e.clientY);
    setCurrentY(e.clientY);
    setIsDragging(true);
    onDragStart?.();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaY = e.clientY - startY;
    setCurrentY(e.clientY);
    onDragMove?.(deltaY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    onDragEnd?.();
  };

  return (
    <motion.div
      className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all cursor-move touch-manipulation ${
        isSelected
          ? 'border-primary bg-primary-50'
          : 'border-gray-200 hover:border-gray-300'
      } ${isDragging ? 'opacity-50 z-50' : ''}`}
      onClick={onClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      animate={{
        y: isDragging ? currentY - startY : 0,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  );
}
