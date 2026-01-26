'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export default function Card({ children, className = '', title }: CardProps) {
  return (
    <div className={`glass-card p-6 ${className}`}>
      {title && (
        <h3 className="text-xl font-bold text-zinc-100 mb-6 flex items-center">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
