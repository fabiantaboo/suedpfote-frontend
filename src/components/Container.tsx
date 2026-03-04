'use client';

import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'main';
}

export function Container({
  children,
  className = '',
  as: Component = 'div',
}: ContainerProps) {
  return (
    <Component
      className={`
        w-full max-w-[1320px] mx-auto
        px-5 md:px-6
        ${className}
      `}
    >
      {children}
    </Component>
  );
}

export default Container;
