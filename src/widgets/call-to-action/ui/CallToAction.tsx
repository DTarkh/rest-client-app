import { routes } from '@/src/shared/constants';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function CallToAction() {
  return (
    <section className='py-20 px-4'>
      <div className='container mx-auto max-w-4xl text-center'>
        <h2 className='text-3xl md:text-4xl font-bold text-foreground mb-4'>
          Ready to Streamline Your API Testing?
        </h2>
        <p className='text-lg text-muted-foreground mb-8 max-w-2xl mx-auto'>
          Join thousands of developers who trust RestClient for their API testing needs. Get started
          today and experience the difference.
        </p>
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Link href={routes.client}>
            <button className='btn-outline'>
              Start
              <ArrowRight className='ml-2 h-4 w-4' />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
