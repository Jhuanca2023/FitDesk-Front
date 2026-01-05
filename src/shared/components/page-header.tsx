import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string | ReactNode;
  description?: string;
  className?: string;
}

export function PageHeader({ title, description, className = '' }: PageHeaderProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {typeof title === 'string' ? (
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      ) : (
        title
      )}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
