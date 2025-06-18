import { ReactNode } from 'react';

interface BoardContainerProps {
  children: ReactNode;
  className?: string;
}

export function BoardContainer({ children, className = '' }: BoardContainerProps) {
  return (
    <div className={`bg-neutral-700 p-4 md:p-6 lg:p-8 rounded-2xl shadow-2xl mb-6 ${className}`}>
      {children}
    </div>
  );
}
