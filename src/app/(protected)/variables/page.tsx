import Spinner from '@/shared/ui/spinner';
import dynamic from 'next/dynamic';

const VariablesPage = dynamic(
  () => import('@/pages-slice/variables-page').then(m => m.VariablesPage),
  {
    loading: () => <Spinner />,
  },
);

export default function Variables() {
  return <VariablesPage />;
}
