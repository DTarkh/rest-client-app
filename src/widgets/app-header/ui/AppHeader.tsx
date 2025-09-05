'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { routes } from '@/src/shared/constants';
import { Button } from '@/src/shared/ui/button';

export function AppHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-lg border-b border-border/50'
          : 'bg-transparent'
      }`}
    >
      <div className='container mx-auto px-4'>
        <div
          className={`flex items-center justify-between transition-all duration-300 ${
            isScrolled ? 'h-16' : 'h-20'
          }`}
        >
          <Link href={routes.home} className='flex items-center gap-3'>
            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-white'>
              <span className='text-xs font-bold'>RC</span>
            </div>
            <span className='text-xl font-bold text-foreground'>RestClient</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center space-x-8'>
            <Link
              href={routes.client}
              className='btn text-sm font-medium hover:text-gray-600 transition-colors
                 text-gray-800'
            >
              Get Started
            </Link>
            <Link
              href={routes.login}
              className='text-sm font-medium  hover:text-gray-600 transition-colors text-gray-800'
            >
              Sign in
            </Link>
            <Button>dfeef</Button>
            <Link
              href={routes.register}
              className='text-sm font-medium  hover:text-gray-600 transition-colors  text-gray-800'
            >
              Register
            </Link>
          </nav>

          <button className='md:hidden p-2' onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? (
              <X className='w-6 h-6 text-foreground' />
            ) : (
              <Menu className='w-6 h-6 text-foreground' />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className='md:hidden py-4 border-t border-border/20'>
            <nav className='flex flex-col space-y-4'>
              <Link
                href={routes.client}
                className='text-sm font-medium hover:text-gray-600 transition-colors
                 text-gray-800'
              >
                Get Started
              </Link>
              <Link
                href={routes.login}
                className='text-sm font-medium  hover:text-gray-600 transition-colors text-gray-800'
              >
                Sign in
              </Link>
              <Link
                href={routes.register}
                className='text-sm font-medium  hover:text-gray-600 transition-colors  text-gray-800'
              >
                Register
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
