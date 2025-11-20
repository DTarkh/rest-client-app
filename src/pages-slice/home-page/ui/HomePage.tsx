import { AppHeader } from '@/widgets/app-header';
import { Footer } from '@/widgets/footer';

import { Features } from './Features';
import { Hero } from './Hero';
import { CallToAction } from './CallToAction';

export function HomePage() {
  return (
    <>
      <AppHeader />
      <main className='min-h-[60vh] flex flex-col items-center justify-center gap-4'>
        <Hero />
        <Features />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
