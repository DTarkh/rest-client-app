'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export default function ActiveLink({ children, href }: { children: ReactNode; href: string }) {
  const currentPath = usePathname();

  const isActive = currentPath === href;

  return (
    <Link
      href={href}
      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
        ${
          isActive
            ? 'bg-amber-500 text-gray-900'
            : 'text-gray-700 hover:bg-amber-400 hover:text-gray-900'
        }`}
    >
      {children}
    </Link>
  );
}
