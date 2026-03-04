'use client';

import { ReactNode } from 'react';

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  bg?: 'main' | 'soft' | 'primary';
  spacing?: 'sm' | 'md' | 'lg';
  id?: string;
}

export function SectionWrapper({
  children,
  className = '',
  bg = 'main',
  spacing = 'lg',
  id,
}: SectionWrapperProps) {
  const bgColors = {
    main: 'bg-[#F6F5F2]',
    soft: 'bg-[#EAE6DF]',
    primary: 'bg-[#0F2E4F] text-white',
  };

  const spacings = {
    sm: 'py-10 md:py-16',      // 80px mobile, 128px desktop
    md: 'py-12 md:py-20',      // 96px mobile, 160px desktop
    lg: 'py-20 md:py-[120px]', // 160px mobile, 120-160px desktop (design spec)
  };

  return (
    <section
      id={id}
      className={`
        ${bgColors[bg]}
        ${spacings[spacing]}
        ${className}
      `}
    >
      {children}
    </section>
  );
}

export default SectionWrapper;
