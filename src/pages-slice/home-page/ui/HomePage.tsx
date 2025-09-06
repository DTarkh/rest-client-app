import { AppHeader } from '@/src/widgets/app-header';
import { CallToAction } from '@/src/widgets/call-to-action';
import { Features } from '@/src/widgets/features';
import { Footer } from '@/src/widgets/footer';
import { Hero } from '@/src/widgets/hero';

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
