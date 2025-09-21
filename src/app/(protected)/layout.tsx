import { ClientNavigation } from '@/widgets/client-navigation';
import { Footer } from '@/widgets/footer';
import { ReactNode } from 'react';

export default function layout({ children }: { children: ReactNode }) {
  return (
    <main className='relative '>
      <ClientNavigation />
      {children}
      <div className='absolute bottom-0 left-0 w-full bg-amber-500 z-50'>
        <Footer />
      </div>
    </main>
  );
}
