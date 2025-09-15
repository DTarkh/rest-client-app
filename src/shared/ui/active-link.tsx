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
            ? 'bg-green-600 text-gray-white text-white font-semibold'
            : 'hover:bg-green-700 hover:text-white  hover:font-semibold text-gray-800 font-semibold'
        }`}
    >
      {children}
    </Link>
  );
}
