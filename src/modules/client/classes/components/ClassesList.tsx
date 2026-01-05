import { motion } from 'motion/react';
import { ClassCard } from './ClassCard';
import type { ClientClass } from '../types';

interface ClassesListProps {
  classes: ClientClass[];
  title: string;
  emptyMessage: string;
  isLoading?: boolean;
}

export function ClassesList({ classes, title, emptyMessage, isLoading }: ClassesListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="bg-card/40 border rounded-xl p-6 animate-pulse"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="h-6 bg-muted rounded w-48"></div>
                  <div className="h-6 bg-muted rounded w-20"></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-muted rounded-full"></div>
                  <div className="h-4 bg-muted rounded w-32"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-24"></div>
                  <div className="h-4 bg-muted rounded w-28"></div>
                  <div className="h-4 bg-muted rounded w-32"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="mx-auto w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-muted rounded-full"></div>
          </div>
          <p className="text-muted-foreground text-lg">{emptyMessage}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-xl font-semibold text-foreground"
      >
        {title}
      </motion.h2>
      
      <div className="grid gap-4">
        {classes.map((classItem, index) => (
          <ClassCard
            key={classItem.id}
            classItem={classItem}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
